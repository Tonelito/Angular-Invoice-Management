import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AuditService } from '../../services/audit.service';
import { MyErrorStateMatcher } from 'src/app/shared/utilities/error.utility';
import { PageEvent } from '@angular/material/paginator';
import { AuditData } from '../../utilities/models/audit.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditComponent implements OnInit {
  auditForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  displayedColumns: string[] = ['entity', 'user', 'operation', 'date'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  tableData: any[] = [];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  @BlockUI() blockUI!: NgBlockUI;

  public options = {
    timeOut: 3000,
    showProgressBar: false,
    pauseOnHover: true,
    clickToClose: true
  };

  constructor(
    private readonly translate: TranslateService,
    private readonly service: AuditService,
    private readonly fb: FormBuilder,
    private readonly _notifications: NotificationsService
  ) {
    this.auditForm = this.fb.group({
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      entity: ['', [Validators.required]],
      fullName: ['']
    });
  }

  ngOnInit() {
    this.loadAllAudits();
  }

  loadAllAudits() {
    this.blockUI.start();
    this.service.getAllAudits(this.pageIndex, this.pageSize).subscribe({
      next: (response: any) => {
        this.updateTableData(response);
        this.blockUI.stop();
      },
      error: error => {
        this.handleError(error);
      }
    });
  }

  performAuditSearch(auditData: AuditData) {
    this.service
      .searchAudits(auditData, this.pageIndex, this.pageSize)
      .subscribe({
        next: (response: any) => {
          this.updateTableData(response);
          this.blockUI.stop();
        },
        error: error => {
          this.handleError(error);
        }
      });
  }

  onSubmit() {
    if (this.auditForm.valid) {
      this.blockUI.start(
        this.translate.instant('AUDIT.NOTIFICATIONS.SENDING_REQUEST')
      );

      const auditData: AuditData = {
        startDate: this.auditForm.value.startDate,
        endDate: this.auditForm.value.endDate,
        entity: this.auditForm.value.entity,
        fullName: this.auditForm.value.fullName
      };

      this.performAuditSearch(auditData);
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
    if (this.auditForm.dirty) {
      this.onSubmit();
    } else {
      this.loadAllAudits();
    }
  }

  updateTableData(response: any) {
    this.tableData = response.object.map((entry: any) => ({
      ...entry,
      entity: entry.entity,
      user: entry.fullName,
      operation: entry.operation,
      date: new Date(entry.datetime).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      formattedRequest: this.formatRequestData(entry.request)
    }));
    this.totalElements = response.totalElements;
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unexpected error occurred';

    if (error.error && error.error.mensaje) {
      errorMessage = error.error.mensaje;
    }

    this._notifications.error('Error', errorMessage);

    console.error('Error:', error);
    this.blockUI.stop();
    this.tableData = [];
    this.totalElements = 0;
  }

  formatRequestData(requestBody: string): string {
    try {
      const parsedData = JSON.parse(requestBody);
      return Object.entries(parsedData)
        .map(([key, value]) => {
          if (value === null) {
            value = 'Not provided';
          }
          if (key === 'dateOfBirth' && typeof value === 'number') {
            value = new Date(value).toLocaleDateString('en-GB');
          }
          return `${key}: ${value}`;
        })
        .join('\n');
    } catch (error) {
      console.error('Error parsing request body', error);
      return 'Invalid request format';
    }
  }
}
