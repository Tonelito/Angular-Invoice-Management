import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';
import { MyErrorStateMatcher } from 'src/app/shared/utilities/error.utility';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  hide = true; // Hide password
  matcher = new MyErrorStateMatcher(); // Error matcher
  @BlockUI() blockUI!: NgBlockUI; // Block UI
  public options = {
    timeOut: 3000,
    showProgressBar: false,
    pauseOnHover: true,
    clickToClose: true
  }; // Notification options

  constructor(
    private readonly translate: TranslateService,
    private readonly fb: FormBuilder,
    private readonly _notifications: NotificationsService,
    private readonly authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;

      this.blockUI.start(
        this.translate.instant('LOGIN.NOTIFICATIONS.LOGGING_IN')
      );

      this.authService.login(loginData).subscribe({
        next: () => {
          this._notifications.success(
            this.translate.instant('LOGIN.NOTIFICATIONS.SUCCESS'),
            this.translate.instant('LOGIN.NOTIFICATIONS.SUCCESS_DESC')
          );
          this.blockUI.stop();
        },
        error: error => {
          this._notifications.error(
            this.translate.instant('LOGIN.NOTIFICATIONS.FAILURE'),
            this.translate.instant('LOGIN.NOTIFICATIONS.FAILURE_DESC')
          );
          console.error(error);
          this.blockUI.stop();
        }
      });
    } else {
      this._notifications.error(
        this.translate.instant('LOGIN.NOTIFICATIONS.INVALID_FORM'),
        this.translate.instant('LOGIN.NOTIFICATIONS.INVALID_FORM_DESC')
      );
    }
  }
}
