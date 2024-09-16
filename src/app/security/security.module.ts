import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './components/login/login.component';
import { SecurityRoutingModule } from './security-routing.module';
@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    SecurityRoutingModule,
    MatButtonModule,
    MatCheckboxModule,
    SharedModule
  ],
  exports: [LoginComponent]
})
export class SecurityModule {}
