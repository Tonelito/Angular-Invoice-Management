import { CommonModule, NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { CirclesComponent } from './components/circles/circles.component';
import { EmailInputComponent } from './components/email-input/email-input.component';
import { MatTableComponent } from './components/mat-table/mat-table.component';
import { PasswordInputComponent } from './components/password-input/password-input.component';

@NgModule({
  declarations: [
    EmailInputComponent,
    PasswordInputComponent,
    CirclesComponent,
    MatTableComponent
  ],
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
    MatIconModule,
    MatTableModule,
    MatPaginatorModule
  ],
  exports: [
    EmailInputComponent,
    PasswordInputComponent,
    CirclesComponent,
    MatTableComponent
  ]
})
export class SharedModule {}
