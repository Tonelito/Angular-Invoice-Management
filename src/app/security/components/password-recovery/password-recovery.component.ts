import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { confirmPasswordValidator } from 'src/app/shared/utilities/confirm-password.validator';
import { AuthService } from '../../services/auth.service';
import { NotificationsService } from 'angular2-notifications';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { REGEX_PASSWORD } from 'src/app/shared/utilities/constants.utility';

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
  @BlockUI() blockUI!: NgBlockUI;
  public options = {
    timeOut: 3000,
    showProgressBar: false,
    pauseOnHover: true,
    clickToClose: true
  }

  constructor(
    private _formBuilder: FormBuilder,
    private serviceAuth: AuthService,
    private readonly _notifications: NotificationsService,
  ) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.secondFormGroup = this._formBuilder.group({
      email: [{ value: '', disabled: true }],
      code: ['', [Validators.required]],
      newPassword: new FormControl<string>('', [Validators.required, Validators.pattern(REGEX_PASSWORD)]),
      newConfirmPassword: new FormControl<string>('', [Validators.required, Validators.pattern(REGEX_PASSWORD)]),
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
    this.serviceAuth.passwordRecovery(email).subscribe({
      next: (response) => {
        console.log('Email sent', response);
        this._notifications.success('Email sent', 'Check your email for the recovery code');
      },
      error: (err) => {
        console.error('Error sending email:', err);
        this._notifications.error('Error sending email', 'Please try again');
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

    this.serviceAuth.verifyCode(verifyData).subscribe({
      next: (response) => {
        console.log('Verification successful', response);
        this._notifications.success('Verification successful', 'Password Recovery successfully');
      },
      error: (err) => {
        console.error('Error during verification:', err);
        this._notifications.error('Error during verification', 'Please try again');
      }
    });
  }

}
