import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { confirmPasswordValidator } from 'src/app/shared/utilities/confirm-password.validator';


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

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', [Validators.required, Validators.email]],
    });

    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: [{ value: '', disabled: true }],
      verificationCode: ['', [Validators.required]],
      newPassword: new FormControl<string>('', [Validators.required]),
      newConfirmPassword: new FormControl<string>('', [Validators.required]),
    }, { validators: confirmPasswordValidator });

    this.firstFormGroup.get('firstCtrl')?.valueChanges.subscribe((email: string) => {
      this.secondFormGroup.get('secondCtrl')?.setValue(email);
    });
  }


  toggleNewConfirmPasswordVisibility() {
    this.hideNewConfirmPassword = !this.hideNewConfirmPassword;
  }

  toggleNewPasswordVisibility() {
    this.hideNewPassword = !this.hideNewPassword;
  }
}
