import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './components/login/login.component';
import { PasswordRecoveryComponent } from './components/password-recovery/password-recovery.component';
import { SecurityRoutingModule } from './security-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { BlockUIModule } from 'ng-block-ui';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { TranslateModule } from '@ngx-translate/core';
import { PasswordChangeComponent } from './components/password-change/password-change.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

@NgModule({
  declarations: [LoginComponent, PasswordChangeComponent, PasswordRecoveryComponent, SignUpComponent],
  imports: [
    CommonModule,
    SecurityRoutingModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatStepperModule,
    ReactiveFormsModule,
    SharedModule,
    BlockUIModule.forRoot(),
    SimpleNotificationsModule.forRoot(),
    TranslateModule
  ],
  exports: [LoginComponent]
})
export class SecurityModule { }
