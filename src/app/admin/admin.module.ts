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
import { ConfirmDialogComponent } from './utilities/confirmDialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [AuditComponent, ProfilesComponent, ConfirmDialogComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    NgIf,
    SharedModule,
    BlockUIModule.forRoot(),
    SimpleNotificationsModule.forRoot(),
    TranslateModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatIconModule,
    MatDialogModule
  ]
})
export class AdminModule {}
