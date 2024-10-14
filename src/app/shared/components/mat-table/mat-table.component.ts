import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import {
  Component,
  Input,
  SimpleChanges,
  ViewChild,
  Output,
  EventEmitter,
  ContentChild,
  TemplateRef,
  OnInit
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-mat-table',
  templateUrl: './mat-table.component.html',
  styleUrls: ['./mat-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      )
    ])
  ]
})
export class MatTableComponent implements OnInit {
  @Input() displayedColumns: string[] = [];
  @Input() tableData: any[] = [];
  @Input() totalElements: number = 0;
  @Input() pageSize: number = 10;
  @Input() pageIndex: number = 0;
  @Output() page = new EventEmitter<PageEvent>();

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Expandable rows
  @Input() expandable_row: boolean = false;
  @ContentChild(TemplateRef) expandedTemplate!: TemplateRef<any>;
  columnsToDisplayWithExpand: string[] = [];
  expandedElement: any | null = null;

  ngOnInit() {
    this.columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  }

  constructor() {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tableData']) {
      this.dataSource.data = this.tableData;
    }
  }

  onPageChange(event: PageEvent) {
    this.page.emit(event);
  }

  toggleRow(element: any) {
    this.expandedElement = this.expandedElement === element ? null : element;
  }
}
