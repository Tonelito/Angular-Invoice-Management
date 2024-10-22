import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MyErrorStateMatcher } from '../../../shared/utilities/error-state-matcher.utility';
import { ReportsService } from '../../services/reports.service';
import { PageEvent } from '@angular/material/paginator';
import { handleError } from '../../../shared/utilities/error-handler.utility';
import { formatRequestData } from '../../../shared/utilities/format.utility';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  //form
  reportsForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  maxDate: Date;

  //table
  displayedColumns: string[] = ['noOrdered', 'nameClient', 'taxes', 'total'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  tableData: any[] = [];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  //notifications and block-ui
  @BlockUI() blockUI!: NgBlockUI;
  public options = {
    timeOut: 3000,
    showProgressBar: false,
    pauseOnHover: true,
    clickToClose: true
  };

  constructor(
    private readonly translate: TranslateService,
    private readonly service: ReportsService,
    private readonly fb: FormBuilder,
    private readonly _notifications: NotificationsService
  ) {
    this.reportsForm = this.fb.group({
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      fullName: ['']
    });
    this.maxDate = new Date();
  }

  ngOnInit() {
    this.loadAllReports();
  }

  loadAllReports() {
    this.blockUI.start();
    this.service.getReports(this.pageIndex, this.pageSize).subscribe({
      next: (response: any) => {
        this.updateTableData(response);
        this.blockUI.stop();
      },
      error: error => {
        handleError(error, this._notifications);
        this.blockUI.stop();
        this.tableData = [];
        this.totalElements = 0;
      }
    });
  }

  performReportSearch(reportData: any) {
    this.service
      .searchReports(reportData, this.pageIndex, this.pageSize)
      .subscribe({
        next: (response: any) => {
          this.updateTableData(response);
          this.blockUI.stop();
        },
        error: error => {
          handleError(error, this._notifications);
          this.blockUI.stop();
          this.tableData = [];
          this.totalElements = 0;
        }
      });
  }

  updateTableData(response: any) {
    this.tableData = response.object.map((entry: any) => ({
      ...entry,
      noOrdered: entry.noOrdered,
      nameClient: entry.nameClient,
      taxes: entry.taxes,
      total: entry.total,
      formattedRequest: formatRequestData(entry.request)
    }));
    this.totalElements = response.object.totalElements;
  }

  onSubmit() {
    if (this.reportsForm.valid) {
      this.pageIndex = 0;
      this.blockUI.start(
        this.translate.instant('AUDIT.NOTIFICATIONS.SENDING_REQUEST')
      );

      const reportData: any = {
        startDate: this.reportsForm.value.startDate,
        endDate: this.reportsForm.value.endDate,
        fullName: this.reportsForm.value.fullName
      };
      this.performReportSearch(reportData);
    } else {
      this._notifications.error(
        this.translate.instant('AUDIT.NOTIFICATIONS.INVALID_FORM'),
        this.translate.instant('AUDIT.NOTIFICATIONS.INVALID_FORM_DESC')
      );
    }
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    if (this.reportsForm.dirty) {
      const reportData: any = {
        startDate: this.reportsForm.value.startDate,
        endDate: this.reportsForm.value.endDate,
        entity: this.reportsForm.value.entity,
        fullName: this.reportsForm.value.fullName
      };
      this.performReportSearch(reportData);
    } else {
      this.loadAllReports();
    }
  }
}
