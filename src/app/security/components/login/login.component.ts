import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';
import { MyErrorStateMatcher } from 'src/app/shared/utilities/error.utility';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  //password hide
  hide = true;
  //error handler
  matcher = new MyErrorStateMatcher();
  //blockUI
  @BlockUI() blockUI!: NgBlockUI;
  //angular2-notifications options
  public options = {
    timeOut: 3000,
    showProgressBar: false,
    pauseOnHover: true,
    clickToClose: true
  };

  constructor(
    private readonly translate: TranslateService,
    private readonly service: LoginService,
    private readonly fb: FormBuilder,
    private readonly _notifications: NotificationsService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
    this.translate.use('es');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };
      this.blockUI.start(
        this.translate.instant('LOGIN.NOTIFICATIONS.LOGGING_IN')
      );

      this.service.login(loginData).subscribe({
        next: (response: any) => {
          this._notifications.success(
            this.translate.instant('LOGIN.NOTIFICATIONS.SUCCESS'),
            this.translate.instant('LOGIN.NOTIFICATIONS.SUCCESS_DESC')
          );
          localStorage.setItem('token', response.token);
          this.blockUI.stop();
        },
        error: error => {
          this._notifications.error(
            this.translate.instant('LOGIN.NOTIFICATIONS.FAILURE'),
            this.translate.instant('LOGIN.NOTIFICATIONS.FAILURE_DESC')
          );
          console.log(error);
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
