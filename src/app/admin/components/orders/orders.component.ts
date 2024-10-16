import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/shared/utilities/error.utility';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { REGEX_ONLY_NUMBERS } from 'src/app/shared/utilities/constants.utility';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent {
  orderForm!: FormGroup;
  matcher = new MyErrorStateMatcher();
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
    private readonly fb: FormBuilder
  ) {
    this.orderForm = this.fb.group({
      client: ['', Validators.required],
      items: this.fb.array([this.createItem()])
    });
  }

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
      total: [{ value: 0, disabled: true }],
      taxes: [{ value: 0, disabled: true }]
    });

    item.get('price')?.valueChanges.subscribe(() => this.calculateTotals(item));
    item
      .get('quantity')
      ?.valueChanges.subscribe(() => this.calculateTotals(item));

    return item;
  }

  get items() {
    return this.orderForm.get('items') as FormArray;
  }

  addItem() {
    this.items.push(this.createItem());
  }

  deleteItem(index: number) {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  calculateTotals(item: FormGroup) {
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

  onSubmit() {
    if (this.orderForm.valid) {
      this._notifications.success(
        this.translate.instant('ORDERS.ORDER_SUBMITTED'),
        this.orderForm.reset(),
        this.deleteAllExceptFirst()
      );
    } else {
      this._notifications.error(this.translate.instant('ORDERS.FORM_INVALID'));
    }
  }

  deleteAllExceptFirst() {
    const firstItem = this.items.at(0);
    this.items.clear();
    this.items.push(firstItem);
  }
}
