import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NotificationsService } from 'angular2-notifications';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/shared/utilities/error-state-matcher.utility';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { REGEX_ONLY_NUMBERS } from 'src/app/shared/utilities/constants.utility';
import { MatDialog } from '@angular/material/dialog';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';
import {
  Customer,
  Customers,
  Product,
  Products
} from '../../utilities/models/order.model';
import { OrderService } from '../../services/order.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orderForm!: FormGroup;
  isSmallScreen = false;
  matcher = new MyErrorStateMatcher();

  //data arrays and autocomplete variables
  customers: Customer[] = [];
  products: Product[] = [];
  filteredClients!: Observable<Customer[]>;
  filteredProducts!: Observable<Product[]>;
  selectedClient: Customer | null = null;
  selectedProduct: Product | null = null;

  @BlockUI() blockUI!: NgBlockUI;
  public options = {
    timeOut: 3000,
    showProgressBar: false,
    pauseOnHover: true,
    clickToClose: true
  };

  constructor(
    private readonly translate: TranslateService,
    private readonly _notifications: NotificationsService,
    private readonly fb: FormBuilder,
    private readonly breakpointObserver: BreakpointObserver,
    private readonly dialog: MatDialog,
    private readonly service: OrderService
  ) {
    this.orderForm = this.fb.group({
      client: ['', Validators.required],
      items: this.fb.array([this.createItem()])
    });
    this.breakpointObserver
      .observe([`(max-width: 1250px)`])
      .subscribe(result => {
        this.isSmallScreen = result.matches;
      });
  }

  ngOnInit() {
    this.fetchCustomers();
    this.fetchProducts();
    this.setupAutoComplete();
  }

  //autocomplete functions
  private setupAutoComplete(): void {
    this.filteredClients = this.orderForm.get('client')!.valueChanges.pipe(
      startWith(null),
      map(value => this._filterClients(value || ''))
    );

    this.items.controls.forEach((control, index) => {
      this.setupProductAutoComplete(control as FormGroup, index);
    });
  }

  private setupProductAutoComplete(control: FormGroup, index: number): void {
    control
      .get('product')!
      .valueChanges.pipe(
        startWith(null),
        map((value: string | null) => {
          return value ? this._filterProducts(value) : this.products.slice();
        })
      )
      .subscribe(filtered => {
        this.filteredProducts = new Observable(observer => {
          observer.next(filtered);
        });

        const selectedProduct = this.products.find(
          product => product.name === control.get('product')?.value
        );

        if (selectedProduct) {
          control.patchValue(
            { price: selectedProduct.price },
            { emitEvent: false }
          );
          this.calculateItemTotals(control);
        } else {
          control.patchValue({ price: 0 }, { emitEvent: false });
          this.calculateItemTotals(control);
        }
      });
  }

  private _filterClients(value: string): Customer[] {
    const filterValue = value.toLowerCase();
    return this.customers.filter(client =>
      client.name.toLowerCase().includes(filterValue)
    );
  }

  private _filterProducts(value: string): Product[] {
    const filterValue = value.toLowerCase();
    return this.products.filter(product =>
      product.name.toLowerCase().includes(filterValue)
    );
  }

  //form functions
  createItem(): FormGroup {
    const item = this.fb.group({
      quantity: [
        1,
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern(REGEX_ONLY_NUMBERS)
        ]
      ],
      product: ['', Validators.required],
      price: [
        0,
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern(REGEX_ONLY_NUMBERS)
        ]
      ],
      total: [0],
      taxes: [0]
    });

    item
      .get('price')
      ?.valueChanges.subscribe(() => this.calculateItemTotals(item));
    item
      .get('quantity')
      ?.valueChanges.subscribe(() => this.calculateItemTotals(item));

    return item;
  }

  get items() {
    return this.orderForm.get('items') as FormArray;
  }

  addItem() {
    const newItem = this.createItem();
    this.items.push(newItem);
    this.setupProductAutoComplete(newItem, this.items.length - 1);
  }

  deleteItem(index: number) {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  calculateItemTotals(item: FormGroup) {
    const quantity = item.get('quantity')?.value ?? 0;
    const price = item.get('price')?.value ?? 0;
    let total = quantity * price;
    let taxes = total * 0.12;
    total = parseFloat(total.toFixed(2));
    taxes = parseFloat(taxes.toFixed(2));

    item.patchValue(
      {
        total: total,
        taxes: taxes
      },
      { emitEvent: false }
    );
  }

  getOrderSubtotal(): number {
    const itemsArray = this.items.controls;
    let totalSum = 0;

    itemsArray.forEach(item => {
      const total = item.get('total')?.value ?? 0;

      totalSum += total;
    });

    return parseFloat(totalSum.toFixed(2));
  }

  getOrderTotal(): number {
    const itemsArray = this.items.controls;
    let totalSum = 0;

    itemsArray.forEach(item => {
      const total = item.get('total')?.value ?? 0;
      const taxes = item.get('taxes')?.value ?? 0;
      totalSum += total + taxes;
    });

    return parseFloat(totalSum.toFixed(2));
  }

  deleteAllExceptFirst() {
    const firstItem = this.items.at(0);
    this.items.clear();
    this.items.push(firstItem);
  }

  onSubmit() {
    if (this.orderForm.valid) {
      this.paymentMethodDialog();
    } else {
      this._notifications.error(this.translate.instant('ORDERS.FORM_INVALID'));
    }
  }

  paymentMethodDialog() {
    const dialogRef = this.dialog.open(PaymentDialogComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //post order and order details redirect
      }
    });
  }

  // API FUNCTIONS
  fetchCustomers(): void {
    this.blockUI.start();
    this.service.getCustomers().subscribe({
      next: (response: Customers) => {
        if (response && response.object) {
          this.customers = response.object;
          console.log(this.customers);
        }
        this.blockUI.stop();
      },
      error: error => {
        console.error('Error fetching customers:', error);
        this.blockUI.stop();
      }
    });
  }

  fetchProducts(): void {
    this.blockUI.start();
    this.service.getProducts().subscribe({
      next: (response: Products) => {
        if (response && response.object) {
          this.products = response.object;
          console.log(this.products);
        }
        this.blockUI.stop();
      },
      error: error => {
        console.error('Error fetching customers:', error);
        this.blockUI.stop();
      }
    });
  }

  postOrder() {}

  postOrderDetails() {}
}
