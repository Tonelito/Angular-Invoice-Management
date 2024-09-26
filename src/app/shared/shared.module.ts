import { CommonModule, NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { CirclesComponent } from './components/circles/circles.component';
import { MatTableComponent } from './components/mat-table/mat-table.component';
import { ListComponent } from './components/list/list.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [CirclesComponent, MatTableComponent, ListComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule ,
    NgIf
  ],
  exports: [CirclesComponent, MatTableComponent, ListComponent]
})
export class SharedModule { }
