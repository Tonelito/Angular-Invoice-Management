import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NotificationsService } from 'angular2-notifications';
import { MatDialog } from '@angular/material/dialog';
import { ClientsService } from '../../services/clients.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/shared/utilities/error.utility';
import { Client, Clients } from '../../utilities/models/client.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { REGEX_NUMBER, REGEX_NUMBER_DPI, REGEX_NUMBER_NIT } from 'src/app/shared/utilities/constants.utility';


@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  clientForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  @BlockUI() blockUI!: NgBlockUI;
  public options = {
    timeOut: 3000,
    showProgressBar: false,
    pauseOnHover: true,
    clickToClose: true
  }

  clients: Client[] = [];
  filteredClients: MatTableDataSource<Client> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  searchQuery = '';
  pageSize = 10;
  currentPage = 0;
  totalClients = 0;
  isEditing: boolean = false;
  selectedClientId!: number;
  clientStatus!: boolean;

  constructor(
    private readonly _notifications: NotificationsService,
    private readonly translate: TranslateService,
    private readonly clientsService: ClientsService,
    private readonly dialog: MatDialog,
    private readonly fb: FormBuilder
  ) {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required]],
      dpi: ['', [Validators.required, Validators.pattern(REGEX_NUMBER_DPI)]],
      passport: ['', [Validators.required, Validators.pattern(REGEX_NUMBER)]],
      nit: ['', [Validators.required, Validators.pattern(REGEX_NUMBER_NIT)]],
      address: ['', [Validators.required]],
    });

    ;
  }

  ngOnInit(): void {
    this.fetchClients();
  }

  fetchClients(): void {
    this.blockUI.start();
    this.clientsService.getCustomers(this.currentPage, this.pageSize).subscribe({
      next: clients => {
        if (clients.object) {
          console.log('Clients loaded: ', clients)
          this.clients = clients.object.object;
          this.filteredClients = new MatTableDataSource(this.clients);
          this.currentPage = clients.object.currentPage;
          this.totalClients = clients.object.totalElements;
        }
        this.blockUI.stop();
      }, error: error => {
        console.error('Error loading clients: ', error);
        this.blockUI.stop();
      }
    })
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchClients();
  }

  addClient(): void {
    if (this.clientForm.valid) {
      const clientData = {
        name: this.clientForm.get('name')?.value,
        dpi: this.clientForm.get('dpi')?.value,
        passport: this.clientForm.get('passport')?.value,
        nit: this.clientForm.get('nit')?.value,
        address: this.clientForm.get('address')?.value,
        status: true
      }
      this.blockUI.start();

      this.clientsService.addClient(clientData).subscribe({
        next: response => {
          console.log('Client added: ', response);
          this._notifications.success(
            this.translate.instant('CLIENTS.NOTIFICATIONS.CUSTOMER_CREATED'),
            this.translate.instant('CLIENTS.NOTIFICATIONS.CUSTOMER_CREATED_DESC')
          )
          this.clientForm.reset();
          this.fetchClients();
        },
        error: error => {
          console.error('Error adding client: ', error);
          this._notifications.error(
            this.translate.instant('CLIENTS.NOTIFICATIONS.CUSTOMER_CREATION_FAILURE'),
            this.translate.instant('CLIENTS.NOTIFICATIONS.CUSTOMER_CREATION_FAILURE_DESC')
          )
          this.blockUI.stop();
        }
      });
    } else {
      this._notifications.error(
        this.translate.instant('CLIENTS.NOTIFICATIONS.INVALID_FORM'),
        this.translate.instant('CLIENTS.NOTIFICATIONS.INVALID_FORM_DESC')
      )
    }
  }

  submitClient(): void {
    if (this.isEditing) {
    } else {
      this.addClient();
    }
  }

}
