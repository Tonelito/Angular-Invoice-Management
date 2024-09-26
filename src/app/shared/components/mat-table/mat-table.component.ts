import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-mat-table',
  templateUrl: './mat-table.component.html',
  styleUrls: ['./mat-table.component.scss']
})
export class MatTableComponent implements AfterViewInit {
  displayedColumns: string[] = ['entity', 'user', 'operation', 'date'];
  dataSource = new MatTableDataSource<AuditEntry>(AUDIT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}

export interface AuditEntry {
  entity: string;
  user: string;
  operation: string;
  date: Date;
}

const AUDIT_DATA: AuditEntry[] = [
  {
    entity: 'Order',
    user: 'jdoe',
    operation: 'Create',
    date: new Date('2023-09-01')
  },
  {
    entity: 'User',
    user: 'asmith',
    operation: 'Update',
    date: new Date('2023-09-02')
  },
  {
    entity: 'Invoice',
    user: 'mbrown',
    operation: 'Delete',
    date: new Date('2023-09-03')
  },
  {
    entity: 'Customer',
    user: 'jdoe',
    operation: 'View',
    date: new Date('2023-09-04')
  },
  {
    entity: 'Product',
    user: 'jdoe',
    operation: 'Create',
    date: new Date('2023-09-05')
  },
  {
    entity: 'Order',
    user: 'asmith',
    operation: 'Update',
    date: new Date('2023-09-06')
  },
  {
    entity: 'User',
    user: 'mbrown',
    operation: 'Delete',
    date: new Date('2023-09-07')
  },
  {
    entity: 'Invoice',
    user: 'jdoe',
    operation: 'View',
    date: new Date('2023-09-08')
  },
  {
    entity: 'Customer',
    user: 'jdoe',
    operation: 'Create',
    date: new Date('2023-09-09')
  },
  {
    entity: 'Product',
    user: 'asmith',
    operation: 'Update',
    date: new Date('2023-09-10')
  }
];
