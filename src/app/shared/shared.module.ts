import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { CirclesComponent } from './components/circles/circles.component';
import { MatTableComponent } from './components/mat-table/mat-table.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [CirclesComponent, MatTableComponent, ConfirmDialogComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    TranslateModule,
    MatButtonModule
  ],
  exports: [CirclesComponent, MatTableComponent]
})
export class SharedModule {}
