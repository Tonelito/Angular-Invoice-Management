import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { CirclesComponent } from './components/circles/circles.component';
import { MatTableComponent } from './components/mat-table/mat-table.component';

@NgModule({
  declarations: [CirclesComponent, MatTableComponent],
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  exports: [CirclesComponent, MatTableComponent]
})
export class SharedModule {}
