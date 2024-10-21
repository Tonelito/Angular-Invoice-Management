import { CanDeactivateFn } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { inject } from '@angular/core';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { Observable } from 'rxjs';

export const canDeactivateGuard: CanDeactivateFn<any> = (
  component
): Observable<boolean> | boolean => {
  const dialog = inject(MatDialog);

  if (component.promptUser) {
    const dialogRef = dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Navigation',
        message: 'Are you sure you want to leave? Some data may be lost.'
      }
    });

    return dialogRef.afterClosed();
  }

  return true;
};
