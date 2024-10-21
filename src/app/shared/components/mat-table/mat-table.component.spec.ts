import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableComponent } from './mat-table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';

describe('MatTableComponent', () => {
  let component: MatTableComponent;
  let fixture: ComponentFixture<MatTableComponent>;

  const mockTableData = [
    { id: 1, name: 'Test 1', description: 'Description 1' },
    { id: 2, name: 'Test 2', description: 'Description 2' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MatTableComponent],
      imports: [
        BrowserAnimationsModule,
        MatTableModule,
        MatPaginatorModule,
        MatIconModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatTableComponent);
    component = fixture.componentInstance;
    component.displayedColumns = ['id', 'name', 'description'];
    component.tableData = mockTableData;
    component.totalElements = mockTableData.length;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct column definitions', () => {
    expect(component.columnsToDisplayWithExpand).toEqual([
      'id',
      'name',
      'description',
      'expand'
    ]);
  });

  it('should render correct number of rows', () => {
    const rows = fixture.debugElement.queryAll(By.css('.example-element-row'));
    expect(rows.length).toBe(mockTableData.length);
  });

  it('should update data source when tableData input changes', () => {
    const newData = [{ id: 3, name: 'Test 3', description: 'Description 3' }];
    component.tableData = newData;
    component.ngOnChanges({
      tableData: {
        currentValue: newData,
        previousValue: mockTableData,
        firstChange: false,
        isFirstChange: () => false
      }
    });
    fixture.detectChanges();

    expect(component.dataSource.data).toEqual(newData);
  });

  it('should emit page event when pagination changes', () => {
    spyOn(component.page, 'emit');
    const pageEvent: PageEvent = {
      pageIndex: 1,
      pageSize: 10,
      length: 20
    };

    component.onPageChange(pageEvent);
    expect(component.page.emit).toHaveBeenCalledWith(pageEvent);
  });

  it('should toggle row expansion', () => {
    const row = mockTableData[0];
    component.toggleRow(row);
    expect(component.expandedElement).toBe(row);

    component.toggleRow(row);
    expect(component.expandedElement).toBeNull();
  });

  it('should handle keyboard events for row expansion', () => {
    const row = mockTableData[0];
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });

    spyOn(enterEvent, 'preventDefault');
    spyOn(spaceEvent, 'preventDefault');

    component.handleKeydown(enterEvent, row);
    expect(component.expandedElement).toBe(row);
    expect(enterEvent.preventDefault).toHaveBeenCalled();

    component.handleKeydown(spaceEvent, row);
    expect(component.expandedElement).toBeNull();
    expect(spaceEvent.preventDefault).toHaveBeenCalled();
  });

  it('should show expand icon when row is not expanded', () => {
    fixture.detectChanges();
    const expandIcon = fixture.debugElement.query(
      By.css('mat-icon')
    ).nativeElement;
    expect(expandIcon.textContent.trim()).toBe('keyboard_arrow_down');
  });

  it('should show collapse icon when row is expanded', () => {
    const row = mockTableData[0];
    component.toggleRow(row);
    fixture.detectChanges();

    const collapseIcon = fixture.debugElement.query(
      By.css('mat-icon')
    ).nativeElement;
    expect(collapseIcon.textContent.trim()).toBe('keyboard_arrow_up');
  });

  it('should apply expanded row class when row is expanded', () => {
    const row = mockTableData[0];
    component.toggleRow(row);
    fixture.detectChanges();

    const expandedRow = fixture.debugElement.query(
      By.css('.example-expanded-row')
    );
    expect(expandedRow).toBeTruthy();
  });

  it('should initialize with correct paginator settings', () => {
    expect(component.pageSize).toBe(10);
    expect(component.pageIndex).toBe(0);
    const paginator = fixture.debugElement.query(
      By.css('mat-paginator')
    ).componentInstance;
    expect(paginator.pageSize).toBe(10);
    expect(paginator.hidePageSize).toBeTrue();
    expect(paginator.showFirstLastButtons).toBeTrue();
  });
});
