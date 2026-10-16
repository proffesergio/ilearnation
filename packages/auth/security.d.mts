export function getAuthReadiness(env?: Record<string, string | undefined>): {
  configured: boolean;
  google: boolean;
  invitations: boolean;
  message: string;
};
export function assertSameOrigin(request: Request, env?: Record<string, string | undefined>): void;
export function assertAuthRequest(request: Request, env?: Record<string, string | undefined>): void;
export function readJson(request: Request, maxBytes?: number): Promise<Record<string, unknown>>;
export function errorResponse(error: unknown): Response;
