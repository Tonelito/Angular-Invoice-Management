import { Component, Input, OnInit, TemplateRef } from '@angular/core';

export interface ListItem {
  [key: string]: any;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @Input() items: ListItem[] = [];
  @Input() itemTemplate!: TemplateRef<{ $implicit: ListItem }>;
  filteredItems: ListItem[] = [];
  paginatedItems: ListItem[] = [];
  pageSize = 10;
  currentPage = 0;

  ngOnInit() {
    this.filteredItems = [...this.items];
    this.updatePaginatedItems();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredItems = this.items.filter(item => Object.values(item).some(value => value.toString().toLowerCase().includes(filterValue.toLowerCase()))
    );
    this.currentPage = 0;
    this.updatePaginatedItems();
  }

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePaginatedItems();
  }

  updatePaginatedItems(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedItems = this.filteredItems.slice(startIndex, endIndex);
  }

}
