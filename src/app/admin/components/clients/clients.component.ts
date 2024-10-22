import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NotificationsService } from 'angular2-notifications';
import { MatDialog } from '@angular/material/dialog';
import { ClientsService } from '../../services/clients.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/shared/utilities/error.utility';
import { Client } from '../../utilities/models/client.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { REGEX_NUMBER, REGEX_NUMBER_DPI, REGEX_NUMBER_NIT } from 'src/app/shared/utilities/constants.utility';
import { requeridPassportDPiNit } from 'src/app/shared/utilities/requeridForm.validator';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';


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
  searchForm: FormGroup;

  constructor(
    private readonly _notifications: NotificationsService,
    private readonly translate: TranslateService,
    private readonly clientsService: ClientsService,
    private readonly dialog: MatDialog,
    private readonly fb: FormBuilder
  ) {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required]],
      dpi: ['', [Validators.pattern(REGEX_NUMBER_DPI)]],
      passport: ['', [Validators.pattern(REGEX_NUMBER)]],
      nit: ['', [Validators.pattern(REGEX_NUMBER_NIT)]],
      address: ['', [Validators.required]],
    }, { validators: requeridPassportDPiNit() });
    this.searchForm = this.fb.group({
      search: ['', []]
    });
  }

  ngOnInit(): void {
    this.fetchClients();
  }

  searchClients(): void {
    const search = this.searchForm.value.search.trim();
    if (search) {
      this.fetchClientsByName();
    } else {
      this.fetchClients();
    }
  }

  fetchClientsByName(): void {
    const search = { name: this.searchForm.value.search };
    this.blockUI.start();
    this.clientsService.getCustomerByName(search, this.currentPage, this.pageSize).subscribe({
      next: clients => {
        if (clients.object) {
          this.clients = clients.object;
          this.filteredClients = new MatTableDataSource(this.clients);
          this.currentPage = clients.currentPage;
          this.totalClients = clients.totalElements;
        }
        this.blockUI.stop();
      }, error: error => {
        console.error('Error loading customers: ', error);
        this.blockUI.stop();
      }
    })
  }

  fetchClientsDetails(customerId: number): void {
    this.clientsService.getCustomerById(customerId).subscribe({
      next: response => {
        this.selectedClientId = customerId;
        this.clientForm.patchValue({
          name: response.object.name,
          dpi: response.object.dpi,
          passport: response.object.passport,
          nit: response.object.nit,
          address: response.object.address,
          status: response.object.status
        });
        this.isEditing = true;
        this.clientForm.markAsPristine();
        this.fetchClients();
        this.clientStatus = response.object.status;

      },

      error: error => {
        console.error('id: ', customerId);
        console.error('Error loading customer details: ', error);

      }
    })

  }

  fetchClients(): void {
    this.blockUI.start();
    this.clientsService.getCustomers(this.currentPage, this.pageSize).subscribe({
      next: clients => {
        if (clients.object) {
          this.clients = clients.object.object;
          this.filteredClients = new MatTableDataSource(this.clients);
          this.currentPage = clients.object.currentPage;
          this.totalClients = clients.object.totalElements;
        }
        this.blockUI.stop();
      }, error: error => {
        console.error('Error loading customers: ', error);
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
      }
      this.blockUI.start();

      this.clientsService.addClient(clientData).subscribe({
        next: response => {
          console.log('Customer added: ', response);
          this._notifications.success(
            this.translate.instant('CUSTOMERS.NOTIFICATIONS.CUSTOMER_CREATED'),
            this.translate.instant('CUSTOMERS.NOTIFICATIONS.CUSTOMER_CREATED_DESC')
          )
          this.clientForm.reset();
          this.fetchClients();
        },
        error: error => {
          console.error('Error adding customer: ', error);
          console.log('Customer data: ', clientData);
          this._notifications.error(
            this.translate.instant('CUSTOMERS.NOTIFICATIONS.CUSTOMER_CREATION_FAILURE'),
            this.translate.instant('CUSTOMERS.NOTIFICATIONS.CUSTOMER_CREATION_FAILURE_DESC')
          )
          this.blockUI.stop();
        }
      });
    } else {
      this._notifications.error(
        this.translate.instant('CUSTOMERS.NOTIFICATIONS.INVALID_FORM'),
        this.translate.instant('CUSTOMERS.NOTIFICATIONS.INVALID_FORM_DESC')
      )
    }
  }

  changeStatus(customerId: number): void {
    this.clientsService.changeStatus(customerId).subscribe({
      next: response => {
        this.fetchClientsDetails(customerId);
        this._notifications.success(
          this.translate.instant('CUSTOMERS.NOTIFICATIONS.STATUS_SUCCESS'), ''
        );
        this.fetchClients();
        this.fetchClientsDetails(customerId);
      },
      error: error => {
        console.error(
          this.translate.instant('CUSTOMERS.ERRORS.STATUS_TOGGLE'),
          error
        );
        this._notifications.error(this.translate.instant('CUSTOMERS.NOTIFICATIONS.STATUS_FAILURE'), '');
      }
    });
  }

  updateClient(): void {
    if (this.clientForm.valid) {
      const updateClientData = {
        name: this.clientForm.value.name,
        dpi: this.clientForm.value.dpi,
        passport: this.clientForm.value.passport,
        nit: this.clientForm.value.nit,
        address: this.clientForm.value.address,
      }
      this.clientsService.updateClient(this.selectedClientId, updateClientData).subscribe({
        next: response => {
          this._notifications.success(this.translate.instant('CUSTOMERS.NOTIFICATIONS.UPDATE_SUCCESS'), '');
          this.fetchClients();
          this.clientForm.reset();
        },
        error: error => {
          console.error(this.translate.instant('CUSTOMERS.ERRORS.UPDATE_CUSTOMER'), error);
          this._notifications.error(this.translate.instant('CUSTOMERS.NOTIFICATIONS.UPDATE_CUSTOMER'), '');
        }
      })
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.clientForm.reset();
  }

  confirmDeleteClient(client: Client): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.instant('CUSTOMERS.DIALOG.TITLE'),
        message: this.translate.instant('CUSTOMERS.DIALOG.MESSAGE', { clientName: client.name })
      }
    });

    this.clientForm.reset();

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteClient(client.customerId);
      }
    })
  }

  deleteClient(customerId: number): void {
    this.blockUI.start(
      this.translate.instant('CUSTOMERS.NOTIFICATIONS.DELETING_CUSTOMER')
    );
    this.clientsService.deleteClient(customerId).subscribe({
      next: response => {
        this._notifications.success(
          this.translate.instant('CUSTOMERS.NOTIFICATIONS.CUSTOMER_DELETED'),
          this.translate.instant('CUSTOMERS.NOTIFICATIONS.CUSTOMER_DELETED_DESC')
        );
        this.fetchClients();
        this.blockUI.stop();
        this.clientForm.reset();
      },
      error: error => {
        console.error('Error deleting customer:', error);
        this._notifications.error(
          this.translate.instant('CUSTOMERS.NOTIFICATIONS.CUSTOMER_DELETE_FAILED'),
          this.translate.instant('CUSTOMERS.NOTIFICATIONS.CUSTOMER_DELETE_FAILED_DESC')
        );
        this.blockUI.stop();
      }
    });
  }

  submitClient(): void {
    if (this.isEditing) {
      this.updateClient();
    } else {
      this.addClient();
    }
  }

}
