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
import { ProfilesComponent } from './components/profiles/profiles.component';
import { BlockUIModule } from 'ng-block-ui';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { TranslateModule } from '@ngx-translate/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { UsersComponent } from './components/users/users.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ClientsComponent } from './components/clients/clients.component';
import { ProductsComponent } from './components/products/products.component';
import { OrdersComponent } from './components/orders/orders.component';

@NgModule({
  declarations: [
    AuditComponent,
    ProfilesComponent,
    HomePageComponent,
    UsersComponent,
    ClientsComponent,
    ProductsComponent,
    OrdersComponent
  ],
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
    MatIconModule,
    MatPaginatorModule,
    NgIf,
    SharedModule,
    BlockUIModule.forRoot(),
    SimpleNotificationsModule.forRoot(),
    TranslateModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatTooltipModule,
    MatAutocompleteModule
  ]
})
export class AdminModule {}
