import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.scss']
})
export class PaymentDialogComponent {
  selectedPaymentMethod: number = 1;

  constructor(public dialogRef: MatDialogRef<PaymentDialogComponent>) {}

  onConfirm(): void {
    this.dialogRef.close(this.selectedPaymentMethod);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
