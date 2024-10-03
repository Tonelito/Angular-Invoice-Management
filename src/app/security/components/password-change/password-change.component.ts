import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { confirmPasswordValidator } from 'src/app/shared/utilities/confirm-password.validator';
import { ChangePasswordService } from '../../services/change-password.service';
import { jwtDecode } from 'jwt-decode';

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

  constructor(
    private _formBuilder: FormBuilder,
    private service: ChangePasswordService
  ) { }

  ngOnInit() {
    this.passwordChangeForm = this._formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: new FormControl<string>('', [Validators.required]),
      newConfirmPassword: new FormControl<string>('', [Validators.required])
    }, { validators: confirmPasswordValidator });

    this.getEmail();
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

  getEmail() {
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.sub = decodedToken.sub;
    }
    console.log('Email:', this.sub);
  }

  onSubmit() {
    if (this.passwordChangeForm.invalid) {
      return;
    }

    const passwordChangeData = {
      email: this.sub,
      newPassword: this.passwordChangeForm.get('newPassword')?.value,
      password: this.passwordChangeForm.get('currentPassword')?.value
    }

    console.log('Password change data:', passwordChangeData);

    this.service.changePassword(passwordChangeData).subscribe({
      next: (response) => {
        console.log('Password changed', response);
      },
      error: (err) => {
        console.error('Error changing password', err);
      }
    });
  }
}
