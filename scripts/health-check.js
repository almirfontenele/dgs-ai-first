#!/usr/bin/env node

/**
 * MCP Server Health Check — NovaTech Logistics Assistant
 *
 * Verifica se todos os MCP servers configurados estão respondendo.
 * Exit code 0 = todos OK. Exit code 1 = um ou mais servidores falharam.
 *
 * Uso:
 *   node scripts/health-check.js
 *   node scripts/health-check.js --env=staging
 *   node scripts/health-check.js --server=github
 *   node scripts/health-check.js --json  (output em JSON para CI)
 *
 * Variáveis de ambiente necessárias (ver health-check.config.json):
 *   GITHUB_PAT, AZURE_SEARCH_ENDPOINT, AZURE_SEARCH_KEY,
 *   AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_KEY, AZURE_DEVOPS_ORG_URL,
 *   AZURE_DEVOPS_PAT, CONFLUENCE_BASE_URL, CONFLUENCE_TOKEN
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');
const path = require('path');
const fs = require('fs');

// --- Config ---

const DEFAULT_TIMEOUT_MS = 5000;
const ARGS = parseArgs(process.argv.slice(2));
const ENV = ARGS.env || 'production';
const JSON_OUTPUT = ARGS.json === true;

function parseArgs(args) {
  const result = {};
  for (const arg of args) {
    const [key, value] = arg.replace(/^--/, '').split('=');
    result[key] = value === undefined ? true : value;
  }
  return result;
}

function loadConfig() {
  const configPath = path.join(__dirname, 'health-check.config.json');
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }
  return {};
}

const config = loadConfig();

// --- HTTP helper ---

function httpGet(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const lib = parsed.protocol === 'https:' ? https : http;
    const timeout = options.timeout || DEFAULT_TIMEOUT_MS;

    const req = lib.request(
      {
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.pathname + parsed.search,
        method: options.method || 'GET',
        headers: options.headers || {},
        timeout,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve({ status: res.statusCode, body }));
      }
    );

    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`TIMEOUT after ${timeout}ms`));
    });

    req.on('error', (err) => reject(err));

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

// --- Server checkers ---

async function checkGitHub() {
  const token = process.env.GITHUB_PAT || config.github?.token;
  if (!token) throw new Error('GITHUB_PAT not configured');

  const res = await httpGet('https://api.github.com/rate_limit', {
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'novatech-health-check/1.0',
      Accept: 'application/vnd.github.v3+json',
    },
    timeout: DEFAULT_TIMEOUT_MS,
  });

  if (res.status !== 200) throw new Error(`GitHub API returned HTTP ${res.status}`);
  const data = JSON.parse(res.body);
  if (!data.rate) throw new Error('Unexpected response shape from GitHub API');
  return { remaining: data.rate.remaining, limit: data.rate.limit };
}

async function checkAzureAiSearch() {
  const endpoint = process.env.AZURE_SEARCH_ENDPOINT || config.azureAiSearch?.endpoint;
  const key = process.env.AZURE_SEARCH_KEY || config.azureAiSearch?.key;
  if (!endpoint || !key) throw new Error('AZURE_SEARCH_ENDPOINT or AZURE_SEARCH_KEY not configured');

  const url = `${endpoint}/indexes?api-version=2023-11-01&$top=1`;
  const res = await httpGet(url, {
    headers: { 'api-key': key, 'Content-Type': 'application/json' },
    timeout: DEFAULT_TIMEOUT_MS,
  });

  if (res.status !== 200) throw new Error(`Azure AI Search returned HTTP ${res.status}`);
  return { indexCount: JSON.parse(res.body).value?.length ?? 0 };
}

async function checkAzureOpenAI() {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT || config.azureOpenAI?.endpoint;
  const key = process.env.AZURE_OPENAI_KEY || config.azureOpenAI?.key;
  const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT || config.azureOpenAI?.deployment || 'gpt-4o';
  if (!endpoint || !key) throw new Error('AZURE_OPENAI_ENDPOINT or AZURE_OPENAI_KEY not configured');

  const url = `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-02-01`;
  const body = JSON.stringify({
    messages: [{ role: 'user', content: 'ping' }],
    max_tokens: 1,
  });

  const res = await httpGet(url, {
    method: 'POST',
    headers: {
      'api-key': key,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
    body,
    timeout: 10000, // OpenAI gets longer timeout
  });

  if (res.status !== 200) throw new Error(`Azure OpenAI returned HTTP ${res.status}`);
  return { deployment: deploymentName, status: 'responding' };
}

async function checkAzureDevOps() {
  const orgUrl = process.env.AZURE_DEVOPS_ORG_URL || config.azureDevOps?.orgUrl;
  const pat = process.env.AZURE_DEVOPS_PAT || config.azureDevOps?.pat;
  if (!orgUrl || !pat) throw new Error('AZURE_DEVOPS_ORG_URL or AZURE_DEVOPS_PAT not configured');

  const token = Buffer.from(`:${pat}`).toString('base64');
  const url = `${orgUrl.replace(/\/$/, '')}/_apis/projects?api-version=7.1&$top=1`;

  const res = await httpGet(url, {
    headers: {
      Authorization: `Basic ${token}`,
      'Content-Type': 'application/json',
    },
    timeout: DEFAULT_TIMEOUT_MS,
  });

  if (res.status !== 200) throw new Error(`Azure DevOps returned HTTP ${res.status}`);
  return { projectCount: JSON.parse(res.body).count ?? 0 };
}

async function checkConfluence() {
  const baseUrl = process.env.CONFLUENCE_BASE_URL || config.confluence?.baseUrl;
  const token = process.env.CONFLUENCE_TOKEN || config.confluence?.token;
  if (!baseUrl || !token) throw new Error('CONFLUENCE_BASE_URL or CONFLUENCE_TOKEN not configured');

  const url = `${baseUrl.replace(/\/$/, '')}/rest/api/space?limit=1`;
  const res = await httpGet(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    timeout: DEFAULT_TIMEOUT_MS,
  });

  if (res.status !== 200) throw new Error(`Confluence returned HTTP ${res.status}`);
  return { accessible: true };
}

// --- Server registry ---

const SERVERS = [
  { name: 'GitHub', key: 'github', check: checkGitHub, criticality: 'essential' },
  { name: 'Azure AI Search', key: 'azureAiSearch', check: checkAzureAiSearch, criticality: 'important' },
  { name: 'Azure OpenAI', key: 'azureOpenAI', check: checkAzureOpenAI, criticality: 'essential', timeout: 10000 },
  { name: 'Azure DevOps', key: 'azureDevOps', check: checkAzureDevOps, criticality: 'important' },
  { name: 'Confluence', key: 'confluence', check: checkConfluence, criticality: 'nice-to-have' },
];

// --- Runner ---

function formatTime(ms) {
  return `${ms}ms`;
}

function timestamp() {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

async function runCheck(server) {
  const start = Date.now();
  try {
    const details = await server.check();
    const latency = Date.now() - start;
    return { name: server.name, key: server.key, status: 'ok', latency, details, criticality: server.criticality };
  } catch (err) {
    const latency = Date.now() - start;
    return {
      name: server.name,
      key: server.key,
      status: 'failed',
      latency,
      error: err.message,
      criticality: server.criticality,
    };
  }
}

async function main() {
  const serversToCheck = ARGS.server
    ? SERVERS.filter((s) => s.key === ARGS.server || s.name.toLowerCase() === ARGS.server.toLowerCase())
    : SERVERS;

  if (!JSON_OUTPUT) {
    console.log(`[${timestamp()}] Health Check Started — env: ${ENV}`);
    console.log('─'.repeat(60));
  }

  const results = await Promise.all(serversToCheck.map((server) => runCheck(server)));

  const ok = results.filter((r) => r.status === 'ok').length;
  const failed = results.filter((r) => r.status === 'failed');
  const essentialFailed = failed.filter((r) => r.criticality === 'essential');

  if (!JSON_OUTPUT) {
    for (const r of results) {
      const icon = r.status === 'ok' ? '✓' : '✗';
      const latencyStr = formatTime(r.latency);
      if (r.status === 'ok') {
        console.log(`[${timestamp()}] ${icon} ${r.name.padEnd(20)} ${latencyStr}`);
      } else {
        console.log(`[${timestamp()}] ${icon} ${r.name.padEnd(20)} ${latencyStr} — ${r.error}`);
      }
    }

    console.log('─'.repeat(60));
    const statusLabel = failed.length === 0 ? 'OK' : essentialFailed.length > 0 ? 'CRITICAL' : 'DEGRADED';
    console.log(
      `[${timestamp()}] Status: ${ok}/${results.length} OK — ${statusLabel}${
        essentialFailed.length > 0 ? ` (essential servers down: ${essentialFailed.map((r) => r.name).join(', ')})` : ''
      }`
    );
  } else {
    console.log(
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          env: ENV,
          summary: { ok, failed: failed.length, total: results.length },
          results,
        },
        null,
        2
      )
    );
  }

  // Exit code: 0 if all OK or only nice-to-have failed, 1 if any essential/important failed
  const exitCode = essentialFailed.length > 0 || failed.filter((r) => r.criticality === 'important').length > 0 ? 1 : 0;
  process.exit(exitCode);
}

main().catch((err) => {
  console.error('Health check crashed:', err.message);
  process.exit(2);
});
