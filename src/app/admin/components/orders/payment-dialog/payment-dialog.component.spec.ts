import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { PaymentDialogComponent } from './payment-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('PaymentDialogComponent', () => {
  let component: PaymentDialogComponent;
  let fixture: ComponentFixture<PaymentDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<PaymentDialogComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [PaymentDialogComponent],
      imports: [
        TranslateModule.forRoot(),
        MatSelectModule,
        MatButtonModule,
        BrowserAnimationsModule
      ],
      providers: [{ provide: MatDialogRef, useValue: dialogRefSpy }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default selected payment method', () => {
    expect(component.selectedPaymentMethod).toBe(1);
  });

  it('should call dialogRef.close with selectedPaymentMethod when onConfirm is called', () => {
    component.selectedPaymentMethod = 2;
    component.onConfirm();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(2);
  });

  it('should call dialogRef.close with null when onCancel is called', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(null);
  });
});
