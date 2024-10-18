import { HttpErrorResponse } from '@angular/common/http';
import { NotificationsService } from 'angular2-notifications';
export function handleError(
  error: HttpErrorResponse,
  _notifications: NotificationsService
): void {
  let errorMessage = 'An unexpected error occurred';

  if (error?.error?.mensaje) {
    errorMessage = error.error.mensaje;
  } else if (error?.error?.error) {
    errorMessage = error.error.error;
  }

  _notifications.error('Error', errorMessage);

  console.error('Error:', error);
}
