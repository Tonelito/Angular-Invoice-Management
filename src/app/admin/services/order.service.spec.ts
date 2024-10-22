import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { OrderService } from './order.service';
import {
  Customers,
  Products,
  OrderForm
} from '../utilities/models/order.model';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderService]
    });

    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding HTTP requests remain
  });

  describe('getCustomers', () => {
    it('should retrieve all customers', () => {
      const mockCustomers: Customers = {
        note: 'List of customers',
        object: [
          {
            customerId: 1,
            name: 'John Doe',
            dpi: '123456789',
            passport: null,
            nit: null,
            address: '123 Main St'
          },
          {
            customerId: 2,
            name: 'Jane Smith',
            dpi: '987654321',
            passport: 'A1234567',
            nit: 'NIT123456',
            address: '456 Elm St'
          }
        ]
      };

      service.getCustomers().subscribe(customers => {
        expect(customers).toEqual(mockCustomers);
      });

      const req = httpMock.expectOne(
        `${service.customer_url}/show-all-customers`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockCustomers); // Respond with mock data
    });
  });

  describe('getProducts', () => {
    it('should retrieve all products', () => {
      const mockProducts: Products = {
        note: 'List of products',
        object: [
          {
            productsId: 1,
            code: 'PROD001',
            name: 'Product 1',
            delivery_time: 5,
            description: 'Description of Product 1',
            price: 100,
            status: true,
            companyOrBrandName: 'Brand A',
            expirationDate: '2025-12-31',
            entryDate: '2024-01-01',
            stock: 50
          },
          {
            productsId: 2,
            code: 'PROD002',
            name: 'Product 2',
            delivery_time: 7,
            description: 'Description of Product 2',
            price: 150,
            status: true,
            companyOrBrandName: 'Brand B',
            expirationDate: '2026-01-01',
            entryDate: '2024-02-01',
            stock: 30
          }
        ]
      };

      service.getProducts().subscribe(products => {
        expect(products).toEqual(mockProducts);
      });

      const req = httpMock.expectOne(
        `${service.product_url}/show-all-products`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts); // Respond with mock data
    });
  });

  describe('sendOrderDetails', () => {
    it('should send order details and return response', () => {
      const orderDetailsData: OrderForm = {
        client: 'Client Name',
        items: [
          {
            quantity: 2,
            product: 'Product 1',
            price: 100,
            total: 200,
            taxes: 10
          }
        ]
      };
      const mockResponse = { success: true }; // Mock response for sending order details

      service.sendOrderDetails(orderDetailsData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${service.orderDetails_url}/create`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(orderDetailsData); // Ensure body matches
      req.flush(mockResponse); // Respond with mock response
    });
  });

  describe('sendOrder', () => {
    it('should send order and return response', () => {
      const orderData: OrderForm = {
        client: 'Client Name',
        items: [
          {
            quantity: 1,
            product: 'Product 2',
            price: 150,
            total: 150,
            taxes: 7.5
          }
        ]
      };
      const mockResponse = { success: true }; // Mock response for sending order

      service.sendOrder(orderData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${service.order_url}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(orderData); // Ensure body matches
      req.flush(mockResponse); // Respond with mock response
    });
  });
});
