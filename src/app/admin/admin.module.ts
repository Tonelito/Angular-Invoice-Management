import { CommonModule, NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AuditComponent } from './components/audit/audit.component';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ListUsersComponent } from './components/user-dashboard/list-users/list-users.component';
import { MatListModule } from '@angular/material/list';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { FormUserComponent } from './components/user-dashboard/form-user/form-user.component';

@NgModule({
  declarations: [AuditComponent, UserDashboardComponent, FormUserComponent, ListUsersComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    FormsModule,
    MatListModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule,
    NgIf,
    SharedModule,
  ],
  exports: [AuditComponent, ListUsersComponent]
})
export class AdminModule { }
