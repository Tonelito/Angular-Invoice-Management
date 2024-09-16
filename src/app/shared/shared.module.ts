import { CommonModule, NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CirclesComponent } from './components/circles/circles.component';
import { EmailInputComponent } from './components/email-input/email-input.component';
import { PasswordInputComponent } from './components/password-input/password-input.component';

@NgModule({
  declarations: [EmailInputComponent, PasswordInputComponent, CirclesComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    NgIf,
    MatIconModule
  ],
  exports: [EmailInputComponent, PasswordInputComponent, CirclesComponent]
})
export class SharedModule {}
