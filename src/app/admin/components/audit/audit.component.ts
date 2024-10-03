import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AuditService } from '../../services/audit.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditComponent {
  //table data
  displayedColumns: string[] = ['entity', 'user', 'operation', 'date'];
  tableData: any[] = [];
  //form variables
  matcher = new MyErrorStateMatcher();
  auditForm: FormGroup;
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
    private translate: TranslateService,
    private service: AuditService,
    private fb: FormBuilder,
    private _notifications: NotificationsService
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
