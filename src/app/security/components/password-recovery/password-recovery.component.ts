import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { confirmPasswordValidator } from 'src/app/shared/utilities/confirm-password.validator';
import { RecoverPasswordService } from '../../services/recover-password.service';
import { VerificCodeService } from '../../services/verific-code.service';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss']
})
export class PasswordRecoveryComponent implements OnInit {
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  hideNewConfirmPassword = true;
  hideNewPassword = true;

  constructor(
    private _formBuilder: FormBuilder,
    private service: RecoverPasswordService,
    private serviceVerify: VerificCodeService) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.secondFormGroup = this._formBuilder.group({
      email: [{ value: '', disabled: true }],
      code: ['', [Validators.required]],
      newPassword: new FormControl<string>('', [Validators.required]),
      newConfirmPassword: new FormControl<string>('', [Validators.required]),
    }, { validators: confirmPasswordValidator });

    this.firstFormGroup.get('email')?.valueChanges.subscribe((email: string) => {
      this.secondFormGroup.patchValue({ email: email });
    });
  }


  toggleNewConfirmPasswordVisibility() {
    this.hideNewConfirmPassword = !this.hideNewConfirmPassword;
  }

  toggleNewPasswordVisibility() {
    this.hideNewPassword = !this.hideNewPassword;
  }

  onSubmit() {
    if (this.firstFormGroup.invalid) {
      return;
    }

    const email = this.firstFormGroup.get('email')?.value;
    console.log('Email:', email);
    this.service.passwordRecovery(email).subscribe({
      next: (response) => {
        console.log('Email sent', response);
      },
      error: (err) => {
        console.error('Error sending email:', err);
      }
    });
  }
  onSubmitVerify() {
    if (this.secondFormGroup.invalid) {
      console.log('Form is invalid');
      return;
    }

    const verifyData = {
      codePassword: {
        code: this.secondFormGroup.get('code')?.value,
        newPassword: this.secondFormGroup.get('newPassword')?.value,
      },
      email: {
        email: this.firstFormGroup.get('email')?.value,
      }
    };

    console.log('Verify Data:', verifyData);

    this.serviceVerify.verifyCode(verifyData).subscribe({
      next: (response) => {
        console.log('Verification successful', response);
      },
      error: (err) => {
        console.error('Error during verification:', err);
      }
    });
  }

}
