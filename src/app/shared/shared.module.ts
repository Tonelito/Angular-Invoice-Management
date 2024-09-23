import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTableComponent } from './components/mat-table/mat-table.component';

@NgModule({
  declarations: [MatTableComponent],
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  exports: [MatTableComponent]
})
export class SharedModule {}
