import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { confirmPasswordValidator } from 'src/app/shared/utilities/confirm-password.validator';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../services/auth.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MyErrorStateMatcher } from 'src/app/shared/utilities/error-state-matcher.utility';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';
import { REGEX_PASSWORD } from 'src/app/shared/utilities/constants.utility';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent implements OnInit {
  hideCurrentPassword = true;
  hideNewPassword = true;
  confirmNewPassword = true;
  passwordChangeForm!: FormGroup;
  sub!: string;

  matcher = new MyErrorStateMatcher();
  @BlockUI() blockUI!: NgBlockUI;
  public options = {
    timeOut: 3000,
    showProgressBar: false,
    pauseOnHover: true,
    clickToClose: true
  };

  constructor(
    private _formBuilder: FormBuilder,
    private serviceAuth: AuthService,
    private readonly translate: TranslateService,
    private readonly _notifications: NotificationsService,
    private router: Router
  ) {
    this.passwordChangeForm = this._formBuilder.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: new FormControl<string>('', [
          Validators.required,
          Validators.pattern(REGEX_PASSWORD)
        ]),
        newConfirmPassword: new FormControl<string>('', [
          Validators.required,
          Validators.pattern(REGEX_PASSWORD)
        ])
      },
      { validators: confirmPasswordValidator }
    );
  }

  ngOnInit() {
    this.getEmail();
  }

  toggleCurrentPasswordVisibility() {
    this.hideCurrentPassword = !this.hideCurrentPassword;
  }

  toggleNewPasswordVisibility() {
    this.hideNewPassword = !this.hideNewPassword;
  }

  toggleConfirmNewPasswordVisibility() {
    this.confirmNewPassword = !this.confirmNewPassword;
  }

  getEmail() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.sub = decodedToken.sub;
    }
  }

  onSubmit() {
    if (this.passwordChangeForm.invalid) {
      return;
    }

    const changePasswordData = {
      email: this.sub,
      newPassword: this.passwordChangeForm.get('newPassword')?.value,
      password: this.passwordChangeForm.get('currentPassword')?.value
    };

    console.log('Password change data:', changePasswordData);

    this.serviceAuth.changePassword(changePasswordData).subscribe({
      next: response => {
        console.log('Password changed', response);
        this._notifications.success('Password changed successfully');

        this.router.navigate(['/admin/home']);
      },
      error: err => {
        console.error('Error changing password', err);
        this._notifications.error('Error changing password');
      }
    });
  }
}
