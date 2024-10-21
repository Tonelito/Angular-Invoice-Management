import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuditComponent } from './audit.component';
import { AuditService } from '../../services/audit.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { BlockUIModule } from 'ng-block-ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AuditData } from '../../utilities/models/audit.model';

describe('AuditComponent', () => {
  let component: AuditComponent;
  let fixture: ComponentFixture<AuditComponent>;
  let service: jasmine.SpyObj<AuditService>;
  let notificationsService: jasmine.SpyObj<NotificationsService>;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('AuditService', [
      'getAllAudits',
      'searchAudits'
    ]);
    const notificationsSpy = jasmine.createSpyObj('NotificationsService', [
      'error'
    ]);

    await TestBed.configureTestingModule({
      declarations: [AuditComponent],
      imports: [
        ReactiveFormsModule,
        BlockUIModule.forRoot(),
        TranslateModule.forRoot(),
        MatPaginatorModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        BrowserAnimationsModule,
        MatNativeDateModule
      ],
      providers: [
        { provide: AuditService, useValue: serviceSpy },
        { provide: NotificationsService, useValue: notificationsSpy },
        TranslateService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    service = TestBed.inject(AuditService) as jasmine.SpyObj<AuditService>;
    notificationsService = TestBed.inject(
      NotificationsService
    ) as jasmine.SpyObj<NotificationsService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditComponent);
    component = fixture.componentInstance;
    service.getAllAudits.and.returnValue(of({ object: [], totalElements: 0 }));
    fixture.detectChanges();
  });

  it('should initialize the form with default values', () => {
    const formValues = {
      startDate: '',
      endDate: '',
      entity: '',
      fullName: ''
    };
    expect(component.auditForm.value).toEqual(formValues);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load all audits on init', () => {
    const mockResponse = {
      object: [
        {
          entity: 'Test',
          fullName: 'John Doe',
          operation: 'CREATE',
          datetime: new Date().toISOString(),
          request: '{}'
        }
      ],
      totalElements: 1
    };

    service.getAllAudits.and.returnValue(of(mockResponse));
    component.ngOnInit();

    expect(service.getAllAudits).toHaveBeenCalledWith(0, 10);
    expect(component.tableData.length).toBe(1);
    expect(component.totalElements).toBe(1);
  });

  it('should handle error when getAllAudits fails', () => {
    service.getAllAudits.and.returnValue(
      throwError(() => new Error('Test error'))
    );
    component.ngOnInit();

    expect(service.getAllAudits).toHaveBeenCalled();
    expect(component.tableData).toEqual([]);
    expect(component.totalElements).toBe(0);
    expect(notificationsService.error).toHaveBeenCalled();
  });

  it('should call searchAudits when onSubmit is triggered', () => {
    const mockDate = new Date('2023-01-01');
    component.auditForm.patchValue({
      startDate: mockDate,
      endDate: mockDate,
      entity: 'Users',
      fullName: 'John Doe'
    });

    const mockResponse = { object: [], totalElements: 0 };
    service.searchAudits.and.returnValue(of(mockResponse));

    component.onSubmit();

    expect(service.searchAudits).toHaveBeenCalledWith(
      {
        startDate: mockDate,
        endDate: mockDate,
        entity: 'Users',
        fullName: 'John Doe'
      },
      0,
      10
    );
  });

  it('should handle form invalid case in onSubmit', () => {
    component.auditForm.patchValue({
      startDate: '',
      endDate: '',
      entity: '',
      fullName: ''
    });

    component.onSubmit();
    expect(notificationsService.error).toHaveBeenCalled();
  });

  it('should call loadAllAudits when form is not dirty on page change', () => {
    spyOn(component, 'loadAllAudits');
    component.auditForm.markAsPristine(); // Mark form as not dirty

    const pageEvent: PageEvent = { pageIndex: 1, pageSize: 10, length: 1 };
    component.onPageChange(pageEvent);

    expect(component.loadAllAudits).toHaveBeenCalled();
  });

  it('should call performAuditSearch when form is dirty on page change', () => {
    spyOn(component, 'performAuditSearch');

    // Patch form with correct values, including userId (fullName as a number)
    const mockDate = '2024-01-01';
    component.auditForm.patchValue({
      startDate: mockDate,
      endDate: mockDate,
      entity: 'Users',
      fullName: 1 // assuming fullName is the userId here
    });

    // Mark the form as dirty to simulate user interaction
    component.auditForm.markAsDirty();

    const pageEvent: PageEvent = { pageIndex: 1, pageSize: 10, length: 1 };

    // Trigger the page change
    component.onPageChange(pageEvent);

    // Check if performAuditSearch was called with the correct values
    expect(component.performAuditSearch).toHaveBeenCalledWith({
      startDate: mockDate,
      endDate: mockDate,
      entity: 'Users',
      fullName: 1
    });
  });

  it('should update tableData and totalElements in updateTableData', () => {
    const mockResponse = {
      object: [
        {
          entity: 'Users',
          fullName: 'John Doe',
          operation: 'CREATE',
          datetime: '2023-01-01T00:00:00Z',
          request: '{}'
        }
      ],
      totalElements: 1
    };

    component.updateTableData(mockResponse);

    expect(component.tableData.length).toBe(1);
    expect(component.tableData[0].entity).toBe('Users');
    expect(component.totalElements).toBe(1);
  });

  it('should handle error when searchAudits fails', () => {
    const auditData: AuditData = {
      startDate: '01-01-24',
      endDate: '01-01-24',
      entity: 'Users',
      fullName: 1
    };

    service.searchAudits.and.returnValue(
      throwError(() => new Error('Test error'))
    );

    component.performAuditSearch(auditData);

    expect(service.searchAudits).toHaveBeenCalled();
    expect(component.tableData).toEqual([]);
    expect(component.totalElements).toBe(0);
    expect(notificationsService.error).toHaveBeenCalled();
  });
});
