import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AuditService } from '../../services/audit.service';
import { MyErrorStateMatcher } from 'src/app/shared/utilities/error.utility';
import { PageEvent } from '@angular/material/paginator';
import { AuditData } from '../../utilities/models/audit.model';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditComponent {
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
      user: ['']
    });
  }

  setupUserSearch() {
    const userValue = this.auditForm.get('user')?.value;

    this.service.searchUser(userValue).subscribe({
      error: error => {
        console.error('Error searching user:', error);
      }
    });
  }

  performAuditSearch(auditData: AuditData) {
    this.service.postAudit(auditData, this.pageIndex, this.pageSize).subscribe({
      next: (response: any) => {
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
        this.blockUI.stop();
      },
      error: error => {
        this._notifications.error(
          this.translate.instant('AUDIT.NOTIFICATIONS.FAILURE'),
          this.translate.instant('AUDIT.NOTIFICATIONS.FAILURE_DESC')
        );
        console.error(error);
        this.blockUI.stop();
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
        entity: this.auditForm.value.entity
      };

      if (this.auditForm.value.user) {
        this.service.searchUser(this.auditForm.value.user).subscribe({
          next: userResponse => {
            if (userResponse.object && userResponse.object.length > 0) {
              auditData['userId'] = userResponse.object[0].userId;
              this.performAuditSearch(auditData);
            } else {
              this._notifications.error(
                this.translate.instant('AUDIT.NOTIFICATIONS.USER_NOT_FOUND'),
                this.translate.instant(
                  'AUDIT.NOTIFICATIONS.USER_NOT_FOUND_DESC'
                )
              );
              this.blockUI.stop();
            }
          },
          error: error => {
            console.error('Error searching user:', error);
            this._notifications.error(
              this.translate.instant('AUDIT.NOTIFICATIONS.USER_SEARCH_ERROR'),
              this.translate.instant(
                'AUDIT.NOTIFICATIONS.USER_SEARCH_ERROR_DESC'
              )
            );
            this.blockUI.stop();
          }
        });
      } else {
        this.performAuditSearch(auditData);
      }
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
    this.onSubmit();
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
