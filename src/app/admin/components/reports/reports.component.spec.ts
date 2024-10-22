import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportsComponent } from './reports.component';
import { ReportsService } from '../../services/reports.service';
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

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;
  let service: jasmine.SpyObj<ReportsService>;
  let notificationsService: jasmine.SpyObj<NotificationsService>;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('ReportsService', [
      'getReports',
      'searchReports'
    ]);
    const notificationsSpy = jasmine.createSpyObj('NotificationsService', [
      'error'
    ]);

    await TestBed.configureTestingModule({
      declarations: [ReportsComponent],
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
        { provide: ReportsService, useValue: serviceSpy },
        { provide: NotificationsService, useValue: notificationsSpy },
        TranslateService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    service = TestBed.inject(ReportsService) as jasmine.SpyObj<ReportsService>;
    notificationsService = TestBed.inject(
      NotificationsService
    ) as jasmine.SpyObj<NotificationsService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    service.getReports.and.returnValue(of({ object: [], totalElements: 0 }));
    fixture.detectChanges();
  });

  it('should initialize the form with default values', () => {
    const formValues = {
      startDate: '',
      endDate: '',
      fullName: ''
    };
    expect(component.reportsForm.value).toEqual(formValues);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle error when getReports fails', () => {
    service.getReports.and.returnValue(
      throwError(() => new Error('Test error'))
    );
    component.ngOnInit();

    expect(service.getReports).toHaveBeenCalled();
    expect(component.tableData).toEqual([]);
    expect(component.totalElements).toBe(0);
    expect(notificationsService.error).toHaveBeenCalled();
  });

  it('should call searchReports when onSubmit is triggered', () => {
    const mockDate = new Date('2023-01-01');
    component.reportsForm.patchValue({
      startDate: mockDate,
      endDate: mockDate,
      fullName: 'John Doe'
    });

    const mockResponse = { object: [], totalElements: 0 };
    service.searchReports.and.returnValue(of(mockResponse));

    component.onSubmit();

    expect(service.searchReports).toHaveBeenCalledWith(
      {
        startDate: mockDate,
        endDate: mockDate,
        fullName: 'John Doe'
      },
      0,
      10
    );
  });

  it('should handle form invalid case in onSubmit', () => {
    component.reportsForm.patchValue({
      startDate: '',
      endDate: '',
      fullName: ''
    });

    component.onSubmit();
    expect(notificationsService.error).toHaveBeenCalled();
  });

  it('should call loadAllReports when form is not dirty on page change', () => {
    spyOn(component, 'loadAllReports');
    component.reportsForm.markAsPristine();

    const pageEvent: PageEvent = { pageIndex: 1, pageSize: 10, length: 1 };
    component.onPageChange(pageEvent);

    expect(component.loadAllReports).toHaveBeenCalled();
  });

  it('should handle error when searchReports fails', () => {
    const reportData = {
      startDate: new Date(),
      endDate: new Date(),
      fullName: 'John Doe'
    };

    service.searchReports.and.returnValue(
      throwError(() => new Error('Test error'))
    );

    component.performReportSearch(reportData);

    expect(service.searchReports).toHaveBeenCalled();
    expect(component.tableData).toEqual([]);
    expect(component.totalElements).toBe(0);
    expect(notificationsService.error).toHaveBeenCalled();
  });
});
