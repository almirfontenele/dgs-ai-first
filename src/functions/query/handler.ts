import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { randomUUID } from "crypto";
import { QueryInputSchema, QueryOutput } from "./validator";
import {
  logger,
  validationError,
  serverError,
  httpStatusForErrorType,
  buildSuccessResponse,
} from "./response-builder";

export async function queryHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const startTime = Date.now();
  const requestId = randomUUID();

  try {
    const rawBody = await request.json().catch(() => null);

    if (typeof rawBody !== "object" || rawBody === null || Array.isArray(rawBody)) {
      const appError = validationError("Request body must be a JSON object", {
        received: typeof rawBody,
      });
      logger.warn({
        function: "query",
        action: "validation_error",
        requestId,
        errorType: appError.type,
        context: appError.context,
      });
      return { status: 400, jsonBody: { error: appError.userMessage, requestId } };
    }

    const parseResult = QueryInputSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const appError = validationError("Input validation failed", {
        fields: parseResult.error.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });
      logger.warn({
        function: "query",
        action: "validation_error",
        requestId,
        errorType: appError.type,
        context: appError.context,
      });
      return {
        status: 400,
        jsonBody: { error: appError.userMessage, details: appError.context.fields, requestId },
      };
    }

    const { question } = parseResult.data;
    logger.info({ function: "query", action: "input_validated", requestId, questionLength: question.length });

    if (!process.env.AZURE_OPENAI_ENDPOINT) {
      logger.warn({ function: "query", action: "pipeline_not_configured", requestId });
      return { status: 503, jsonBody: { error: "Pipeline not yet configured.", requestId } };
    }

    // TODO Task 2.2.1.2: Call getEmbedding(question)
    // TODO Task 2.2.1.3: Call searchDocuments(embedding)
    // TODO Task 2.2.1.4: Call buildPrompt(question, chunks, systemPrompt)
    // TODO Task 2.2.1.5: Call queryModel(prompt)

    const response: QueryOutput = {
      answer: "Placeholder response — pipeline not yet connected.",
      sources: [],
      confidence: 0,
    };

    const built = buildSuccessResponse(response, requestId, startTime);
    if (!built) {
      return { status: 500, jsonBody: { error: "Internal error processing response.", requestId } };
    }
    return built;
  } catch (error) {
    const duration = Date.now() - startTime;
    const appError = serverError("Unexpected error in query handler", { error: String(error) });
    logger.error({
      function: "query",
      action: "error",
      requestId,
      errorType: appError.type,
      context: appError.context,
      duration,
    });
    return {
      status: httpStatusForErrorType(appError.type),
      jsonBody: { error: appError.userMessage, requestId },
    };
  }
}

app.http("query", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "query",
  handler: queryHandler,
});
