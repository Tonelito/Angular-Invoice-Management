import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AuditService } from '../../services/audit.service';
import { MyErrorStateMatcher } from 'src/app/shared/utilities/error.utility';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditComponent {
  auditForm: FormGroup;
  //error handler
  matcher = new MyErrorStateMatcher();
  //table
  displayedColumns: string[] = ['entity', 'user', 'operation', 'date'];
  tableData: any[] = [];
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
      date: ['', [Validators.required]],
      entity: ['', [Validators.required]]
    });
    this.translate.use('es');
  }

  onSubmit() {
    if (this.auditForm.valid) {
      const auditData = {
        date: this.auditForm.value.date,
        entity: this.auditForm.value.entity
      };

      this.blockUI.start(
        this.translate.instant('AUDIT.NOTIFICATIONS.SENDING_REQUEST')
      );

      this.service.postAudit(auditData).subscribe({
        next: (response: any) => {
          console.log(response);
          this.tableData = response.content.map((entry: any) => ({
            entity: entry.entity,
            user: entry.fullName,
            operation: entry.operation,
            date: new Date(entry.datetime).toLocaleDateString('en-GB')
          }));
          this._notifications.success(
            this.translate.instant('AUDIT.NOTIFICATIONS.SUCCESS'),
            this.translate.instant('AUDIT.NOTIFICATIONS.SUCCESS_DESC')
          );
          this.blockUI.stop();
        },
        error: error => {
          this._notifications.error(
            this.translate.instant('AUDIT.NOTIFICATIONS.FAILURE'),
            this.translate.instant('AUDIT.NOTIFICATIONS.FAILURE_DESC')
          );
          console.log(error);
          this.blockUI.stop();
        }
      });
    } else {
      this._notifications.error(
        this.translate.instant('AUDIT.NOTIFICATIONS.INVALID_FORM'),
        this.translate.instant('AUDIT.NOTIFICATIONS.INVALID_FORM_DESC')
      );
    }
  }
}
