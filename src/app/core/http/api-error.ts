import { HttpErrorResponse } from '@angular/common/http';

export function apiErrorMessage(err: unknown, fallback = 'დაფიქსირდა შეცდომა'): string {
  if (!(err instanceof HttpErrorResponse)) return fallback;
  if (err.status === 0) return 'სერვერთან კავშირი ვერ დამყარდა';

  const body: unknown = err.error;
  if (body && typeof body === 'object') {
    const b = body as { message?: unknown; detail?: unknown; errors?: Record<string, string[]> };
    if (typeof b.message === 'string' && b.message) return b.message;
    if (typeof b.detail === 'string' && b.detail) return b.detail;
    const firstValidation = b.errors && Object.values(b.errors).flat()[0];
    if (firstValidation) return firstValidation;
  }
  return fallback;
}
