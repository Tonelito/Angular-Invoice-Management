import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AuditService } from '../../services/audit.service';
import { MyErrorStateMatcher } from 'src/app/shared/utilities/error-state-matcher.utility';
import { PageEvent } from '@angular/material/paginator';
import { AuditData } from '../../utilities/models/audit.model';
import { handleError } from 'src/app/shared/utilities/error-handler.utility';
import { formatRequestData } from 'src/app/shared/utilities/format.utility';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditComponent implements OnInit {
  //form
  auditForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  maxDate: Date;

  //table
  displayedColumns: string[] = ['entity', 'user', 'operation', 'date'];
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
    this.maxDate = new Date();
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
        handleError(error, this._notifications);
        this.blockUI.stop();
        this.tableData = [];
        this.totalElements = 0;
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
      formattedRequest: formatRequestData(entry.request)
    }));
    this.totalElements = response.totalElements;
  }
  
  onSubmit() {
    if (this.auditForm.valid) {
      this.pageIndex = 0;
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
      const auditData: AuditData = {
        startDate: this.auditForm.value.startDate,
        endDate: this.auditForm.value.endDate,
        entity: this.auditForm.value.entity,
        fullName: this.auditForm.value.fullName
      };
      this.performAuditSearch(auditData);
    } else {
      this.loadAllAudits();
    }
  }
}
