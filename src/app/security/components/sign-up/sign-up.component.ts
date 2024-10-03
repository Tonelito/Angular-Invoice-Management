import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SingUpService } from '../../services/sing-up.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  signUpForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: SingUpService
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
      profileId: 1,
      dateOfBirth: new Date(Date.now()),
    }
    console.log('Data : ', signUpData);

    this.service.singUp(signUpData).subscribe({
      next: (response) => {
        console.log('Response:', response);
      },
      error: (error) => {
        console.log('Error:', error);
      }
    })
  }
}
