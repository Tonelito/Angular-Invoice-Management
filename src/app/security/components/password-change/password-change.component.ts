import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { confirmPasswordValidator } from 'src/app/shared/utilities/confirm-password.validator';

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

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.passwordChangeForm = this._formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: new FormControl<string>('', [Validators.required]),
      newConfirmPassword: new FormControl<string>('', [Validators.required])
    }, { validators: confirmPasswordValidator });
  };

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
