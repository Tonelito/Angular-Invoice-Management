import { Component } from '@angular/core';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent {

  hideCurrentPassword = true;
  hideNewPassword = true;
  
  confirmNewPassword = true;

  toggleCurrentPasswordVisibility() {
    this.hideCurrentPassword = !this.hideCurrentPassword;
  }

  toggleNewPasswordVisibility() {
    this.hideNewPassword = !this.hideNewPassword;
  }
  
  toggleConfirmNewPasswordVisibility() {
    this.confirmNewPassword = !this.confirmNewPassword;
  }
}
