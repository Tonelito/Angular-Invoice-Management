import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';

/* Error matcher for material inputs */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  //form variables
  matcher = new MyErrorStateMatcher();
  loginForm: FormGroup;
  //password hide
  hide = true;
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
    private translate: TranslateService,
    private service: LoginService,
    private fb: FormBuilder,
    private _notifications: NotificationsService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
    this.translate.use('en');
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
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
          // Use translated success message
          this._notifications.success(
            this.translate.instant('LOGIN.NOTIFICATIONS.SUCCESS'),
            this.translate.instant('LOGIN.NOTIFICATIONS.SUCCESS_DESC')
          );
          localStorage.setItem('token', response.token);
          this.blockUI.stop();
        },
        error: error => {
          // Use translated error message
          this._notifications.error(
            this.translate.instant('LOGIN.NOTIFICATIONS.FAILURE'),
            this.translate.instant('LOGIN.NOTIFICATIONS.FAILURE_DESC')
          );
          console.log(error);
          this.blockUI.stop();
        }
      });
    } else {
      // Use translated form error message
      this._notifications.error(
        this.translate.instant('LOGIN.NOTIFICATIONS.INVALID_FORM'),
        this.translate.instant('LOGIN.NOTIFICATIONS.INVALID_FORM_DESC')
      );
    }
  }
}
