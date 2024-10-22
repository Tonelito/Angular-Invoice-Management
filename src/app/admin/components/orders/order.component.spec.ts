import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { OrdersComponent } from './orders.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { OrderService } from '../../services/order.service';
import { of, throwError } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BlockUIModule } from 'ng-block-ui';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('OrdersComponent', () => {
  let component: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;
  let orderService: jasmine.SpyObj<OrderService>;
  let notificationsService: jasmine.SpyObj<NotificationsService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let breakpointObserver: jasmine.SpyObj<BreakpointObserver>;

  const mockCustomers = {
    note: 'Success',
    object: [
      {
        customerId: 1,
        name: 'John Doe',
        dpi: '12345',
        address: '123 Street'
      },
      {
        customerId: 2,
        name: 'Jane Smith',
        dpi: '67890',
        address: '456 Avenue'
      }
    ]
  };

  const mockProducts = {
    note: 'Success',
    object: [
      {
        productsId: 1,
        code: 'P001',
        name: 'Product 1',
        delivery_time: 2,
        description: 'Description 1',
        price: 100,
        status: true,
        companyOrBrandName: 'Brand 1',
        expirationDate: '2024-12-31',
        entryDate: '2024-01-01',
        stock: 50
      },
      {
        productsId: 2,
        code: 'P002',
        name: 'Product 2',
        delivery_time: 3,
        description: 'Description 2',
        price: 200,
        status: true,
        companyOrBrandName: 'Brand 2',
        expirationDate: '2024-12-31',
        entryDate: '2024-01-01',
        stock: 30
      }
    ]
  };

  beforeEach(async () => {
    orderService = jasmine.createSpyObj('OrderService', [
      'getCustomers',
      'getProducts',
      'sendOrder',
      'sendOrderDetails'
    ]);
    notificationsService = jasmine.createSpyObj('NotificationsService', [
      'success',
      'error'
    ]);
    dialog = jasmine.createSpyObj('MatDialog', ['open']);
    breakpointObserver = jasmine.createSpyObj('BreakpointObserver', [
      'observe'
    ]);

    const mockBreakpointState: BreakpointState = {
      matches: false,
      breakpoints: {
        '(max-width: 1250px)': false
      }
    };

    breakpointObserver.observe.and.returnValue(of(mockBreakpointState));
    orderService.getCustomers.and.returnValue(of(mockCustomers));
    orderService.getProducts.and.returnValue(of(mockProducts));

    await TestBed.configureTestingModule({
      declarations: [OrdersComponent],
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        MatAutocompleteModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        BlockUIModule.forRoot()
      ],
      providers: [
        FormBuilder,
        { provide: OrderService, useValue: orderService },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: MatDialog, useValue: dialog },
        { provide: BreakpointObserver, useValue: breakpointObserver },
        TranslateService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    TestBed.inject(TranslateService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize with empty form', () => {
      expect(component.orderForm.get('client')?.value).toBe('');
      expect(component.orderForm.get('invoice_id')?.value).toBe(0);
      expect(component.items.length).toBe(1);
    });

    it('should fetch customers and products on init', fakeAsync(() => {
      component.ngOnInit();
      tick();

      expect(orderService.getCustomers).toHaveBeenCalled();
      expect(orderService.getProducts).toHaveBeenCalled();
      expect(component.customers).toEqual(mockCustomers.object);
      expect(component.products).toEqual(mockProducts.object);
    }));
  });

  describe('Item Management', () => {
    it('should add new item', () => {
      const initialLength = component.items.length;
      component.addItem();
      expect(component.items.length).toBe(initialLength + 1);
    });

    it('should delete item', () => {
      component.addItem();
      const initialLength = component.items.length;
      component.deleteItem(1);
      expect(component.items.length).toBe(initialLength - 1);
    });

    it('should not delete last item', () => {
      expect(component.items.length).toBe(1);
      component.deleteItem(0);
      expect(component.items.length).toBe(1);
    });
  });

  describe('Order Calculations', () => {
    it('should calculate order subtotal correctly', fakeAsync(() => {
      component.addItem();
      component.items.controls[0].patchValue({
        quantity: 2,
        price: 100,
        total: 200,
        taxes: 24
      });
      component.items.controls[1].patchValue({
        quantity: 1,
        price: 150,
        total: 150,
        taxes: 18
      });
      tick();

      expect(component.getOrderSubtotal()).toBe(350);
    }));

    it('should calculate order total with taxes correctly', fakeAsync(() => {
      component.addItem();
      component.items.controls[0].patchValue({
        quantity: 2,
        price: 100,
        total: 200,
        taxes: 24
      });
      component.items.controls[1].patchValue({
        quantity: 1,
        price: 150,
        total: 150,
        taxes: 18
      });
      tick();

      expect(component.getOrderTotal()).toBe(392);
    }));
  });

  describe('Form Submission', () => {
    it('should show error notification when form is invalid', () => {
      component.onSubmit();
      expect(notificationsService.error).toHaveBeenCalled();
    });

    it('should create order when payment method is selected', fakeAsync(() => {
      const mockOrderResponse = { invoiceId: 1 };
      orderService.sendOrder.and.returnValue(of(mockOrderResponse));
      orderService.sendOrderDetails.and.returnValue(of({}));

      component.createOrder(1);
      tick();

      expect(orderService.sendOrder).toHaveBeenCalled();
      expect(orderService.sendOrderDetails).toHaveBeenCalled();
      expect(notificationsService.success).toHaveBeenCalled();
    }));

    it('should handle error when creating order', fakeAsync(() => {
      const errorMessage = 'Error creating order';
      orderService.sendOrder.and.returnValue(
        throwError(() => new Error(errorMessage))
      );

      component.createOrder(1);
      tick();

      expect(notificationsService.error).toHaveBeenCalled();
    }));
  });
});
