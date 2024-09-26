import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { FormUserComponent } from './components/user-dashboard/form-user/form-user.component';
import { ListUsersComponent } from './components/user-dashboard/list-users/list-users.component';
import { AdminRoutingModule } from './admin-routing.module';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
    UserDashboardComponent,
    FormUserComponent,
    ListUsersComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatListModule,
    MatIconModule,
    SharedModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatPaginatorModule
  ],
  exports: [
    UserDashboardComponent
  ]
})
  export class AdminModule { }
