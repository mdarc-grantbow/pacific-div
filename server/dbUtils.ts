import { pool } from "./db";

export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown,
    public readonly isConnectionError: boolean = false
  ) {
    super(message);
    this.name = "DatabaseError";
  }
}

export function isDatabaseConnectionError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("connection") ||
      message.includes("timeout") ||
      message.includes("econnrefused") ||
      message.includes("enotfound") ||
      message.includes("network") ||
      message.includes("socket") ||
      message.includes("unavailable") ||
      message.includes("too many clients") ||
      message.includes("connection terminated")
    );
  }
  return false;
}

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    return true;
  } catch (error) {
    console.error("Database connection check failed:", error);
    return false;
  }
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (!isDatabaseConnectionError(error)) {
        throw error;
      }

      console.warn(
        `Database operation failed (attempt ${attempt}/${maxRetries}):`,
        error instanceof Error ? error.message : error
      );

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  throw new DatabaseError(
    `Database operation failed after ${maxRetries} attempts`,
    lastError,
    true
  );
}

export function handleDatabaseError(error: unknown, operation: string): never {
  const isConnection = isDatabaseConnectionError(error);
  console.error(`Database error during ${operation}:`, error);

  throw new DatabaseError(
    isConnection
      ? `Database temporarily unavailable during ${operation}`
      : `Database error during ${operation}`,
    error,
    isConnection
  );
}
