export type OperationStatus =
  | 'pending'
  | 'running'
  | 'succeeded'
  | 'failed'
  | 'expired';

export type AttemptOutcome = 'applied' | 'noop' | 'retryable' | 'permanent';

export interface Operation {
  id: number;
  idempotencyKey: string;
  kind: string;
  payload: unknown;
  status: OperationStatus;
  attempts: number;
  maxAttempts: number;
  nextAttemptAt: number;
  expiresAt: number | null;
  leaseExpiresAt: number | null;
  lastError: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface Attempt {
  id: number;
  operationId: number;
  attemptNumber: number;
  outcome: AttemptOutcome;
  error: string | null;
  durationMs: number;
  startedAt: number;
}

export type HandlerResult =
  | { outcome: 'applied'; detail?: string }
  | { outcome: 'noop'; detail?: string };

export class PermanentFailure extends Error {
  override readonly name = 'PermanentFailure';
}

export interface SubmitOptions {
  idempotencyKey: string;
  kind: string;
  payload?: unknown;
  maxAttempts?: number;
  ttlMs?: number;
  delayMs?: number;
}

export type Handler = (payload: unknown, ctx: HandlerContext) => Promise<HandlerResult>;

export interface HandlerContext {
  operationId: number;
  idempotencyKey: string;
  attemptNumber: number;
}
