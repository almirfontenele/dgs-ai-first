import pino from "pino";
import { QueryOutput, QueryOutputSchema } from "./validator";

export const logger = pino({ level: process.env.LOG_LEVEL ?? "info" });

export type ErrorType =
  | "VALIDATION_ERROR"
  | "EXTERNAL_SERVICE_ERROR"
  | "SERVER_ERROR"
  | "NOT_FOUND";

export interface AppError {
  type: ErrorType;
  message: string;
  userMessage: string;
  context: Record<string, unknown>;
  timestamp: string;
}

export const validationError = (message: string, context?: Record<string, unknown>): AppError => ({
  type: "VALIDATION_ERROR",
  message,
  userMessage: "Please check your input and try again.",
  context: context ?? {},
  timestamp: new Date().toISOString(),
});

export const serverError = (message: string, context?: Record<string, unknown>): AppError => ({
  type: "SERVER_ERROR",
  message,
  userMessage: "We're having trouble processing your question. Please try again.",
  context: context ?? {},
  timestamp: new Date().toISOString(),
});

export const httpStatusForErrorType = (type: ErrorType): number => {
  const mapping: Record<ErrorType, number> = {
    VALIDATION_ERROR: 400,
    NOT_FOUND: 404,
    EXTERNAL_SERVICE_ERROR: 503,
    SERVER_ERROR: 500,
  };
  return mapping[type];
};

export function buildSuccessResponse(
  response: QueryOutput,
  requestId: string,
  startTime: number
): { status: number; jsonBody: unknown } | null {
  const outputValidation = QueryOutputSchema.safeParse(response);
  if (!outputValidation.success) {
    logger.error({
      function: "query",
      action: "output_schema_violation",
      requestId,
      errors: outputValidation.error.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
        received: e.code,
      })),
    });
    return null;
  }

  const duration = Date.now() - startTime;
  logger.info({
    function: "query",
    action: "response_sent",
    requestId,
    confidence: outputValidation.data.confidence,
    sourceCount: outputValidation.data.sources.length,
    duration,
  });

  return { status: 200, jsonBody: outputValidation.data };
}
