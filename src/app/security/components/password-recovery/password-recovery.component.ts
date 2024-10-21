import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { confirmPasswordValidator } from 'src/app/shared/utilities/confirm-password.validator';
import { AuthService } from '../../services/auth.service';
import { NotificationsService } from 'angular2-notifications';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { REGEX_PASSWORD } from 'src/app/shared/utilities/constants.utility';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core'; // Importar el servicio de traducción

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
    private router: Router,
    private translate: TranslateService
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
        this._notifications.success(this.translate.instant('PASSWORD_RECOVERY.NOTIFICATIONS.SUCCESS'), this.translate.instant('LOGIN.NOTIFICATIONS.SUCCESS_DESC'));
      },
      error: (err) => {
        console.error('Error sending email:', err);
        this._notifications.error(this.translate.instant('PASSWORD_RECOVERY.NOTIFICATIONS.FAILURE'), this.translate.instant('LOGIN.NOTIFICATIONS.FAILURE_DESC'));
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
        this._notifications.success(this.translate.instant('PASSWORD_RECOVERY.NOTIFICATIONS.SUCCESS'), this.translate.instant('LOGIN.NOTIFICATIONS.SUCCESS_DESC'));
        this.router.navigate(['/security/login']);
      },
      error: (err) => {
        console.error('Error during verification:', err);
        this._notifications.error(this.translate.instant('PASSWORD_RECOVERY.NOTIFICATIONS.FAILURE'), this.translate.instant('LOGIN.NOTIFICATIONS.FAILURE_DESC'));
      }
    });
  }
}
