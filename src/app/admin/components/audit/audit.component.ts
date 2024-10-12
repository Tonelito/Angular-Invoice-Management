import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AuditService } from '../../services/audit.service';
import { MyErrorStateMatcher } from 'src/app/shared/utilities/error.utility';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

interface AuditData {
  startDate: string;
  endDate: string;
  entity: string;
  userId?: number;
}

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditComponent implements OnInit {
  auditForm: FormGroup;
  //error handler
  matcher = new MyErrorStateMatcher();
  //table
  displayedColumns: string[] = ['entity', 'user', 'operation', 'date'];
  tableData: any[] = [];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  //blockUI
  @BlockUI() blockUI!: NgBlockUI;
  //angular2-notifications options
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

  ngOnInit() {
    this.setupUserSearch();
  }

  setupUserSearch() {
    this.auditForm
      .get('user')
      ?.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(value => this.service.searchUser(value))
      )
      .subscribe({
        next: response => {
          console.log('User search response:', response);
        },
        error: error => {
          console.error('Error searching user:', error);
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

  performAuditSearch(auditData: AuditData) {
    this.service.postAudit(auditData, this.pageIndex, this.pageSize).subscribe({
      next: (response: any) => {
        this.tableData = response.object.map((entry: any) => ({
          entity: entry.entity,
          user: entry.fullName,
          operation: entry.operation,
          date: new Date(entry.datetime).toLocaleDateString('en-GB')
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

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.onSubmit();
  }
}
