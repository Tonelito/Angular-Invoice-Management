import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NotificationsService } from 'angular2-notifications';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  signUpForm: FormGroup;
  @BlockUI() blockUI!: NgBlockUI;
  public options = {
    timeOut: 3000,
    showProgressBar: false,
    pauseOnHover: true,
    clickToClose: true
  }

  constructor(
    private fb: FormBuilder,
    private serviceAuth: AuthService,
    private readonly _notifications: NotificationsService,
  ) {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.signUpForm.invalid) {
      return;
    }

    const signUpData = {
      email: this.signUpForm.get('email')?.value,
      fullName: this.signUpForm.get('fullName')?.value,
      profileId: 2,
      dateOfBirth: new Date(Date.now()),
    }
    console.log('Data : ', signUpData);

    this.serviceAuth.singUp(signUpData).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this._notifications.success('User created', 'User created successfully');
      },
      error: (error) => {
        console.log('Error:', error);
        this._notifications.error('Error', 'Error creating user');
      }
    })
  }
}
