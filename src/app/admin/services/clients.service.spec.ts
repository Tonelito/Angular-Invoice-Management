import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { ClientsService } from './clients.service';
import { API_URL_CUSTOMER } from 'src/app/shared/utilities/constants.utility';
import {
  ClientName,
  ClientResponse,
  Clients,
  Client
} from '../utilities/models/client.model';

describe('ClientsService', () => {
  let service: ClientsService;
  let httpMock: HttpTestingController;

  const mockClient: Client = {
    name: 'John Doe',
    dpi: '123456789',
    passport: 'A12345678',
    nit: '987654321',
    address: '123 Main St',
    status: true,
    customerId: 1
  };

  // Corrected mockClientsResponse to include the Client properties
  const mockClientsResponse: Clients = {
    ...mockClient, // Spread mockClient properties
    note: 'Clients retrieved successfully',
    object: {
      object: [mockClient],
      totalElements: 1,
      totalPages: 1,
      currentPage: 1,
      pageSize: 10
    }
  };

  const mockClientResponse: ClientResponse = {
    note: 'Client retrieved successfully',
    object: mockClient
  };

  const mockClientNameResponse: ClientName = {
    name: 'John Doe',
    object: [mockClient],
    totalElements: 1,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClientsService]
    });

    service = TestBed.inject(ClientsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensures that no unmatched requests are outstanding.
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCustomers', () => {
    it('should fetch customers from the API', () => {
      const page = 1;
      const size = 10;

      service.getCustomers(page, size).subscribe(response => {
        expect(response).toEqual(mockClientsResponse);
      });

      const req = httpMock.expectOne(
        `${API_URL_CUSTOMER}/show-all?page=${page}&size=${size}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockClientsResponse);
    });
  });

  describe('getCustomerById', () => {
    it('should fetch a customer by id', () => {
      const id = 1;

      service.getCustomerById(id).subscribe(response => {
        expect(response).toEqual(mockClientResponse);
      });

      const req = httpMock.expectOne(`${API_URL_CUSTOMER}/show-by-id/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockClientResponse);
    });
  });

  describe('getCustomerByName', () => {
    it('should fetch customers by name', () => {
      const customerData = { name: 'John Doe' };
      const page = 1;
      const size = 10;

      service
        .getCustomerByName(customerData, page, size)
        .subscribe(response => {
          expect(response).toEqual(mockClientNameResponse);
        });

      const req = httpMock.expectOne(
        `${API_URL_CUSTOMER}/search-by-name?page=${page}&size=${size}`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(customerData);
      req.flush(mockClientNameResponse);
    });
  });

  describe('addClient', () => {
    it('should add a client', () => {
      const clientData = {
        name: 'New Client',
        dpi: '987654321',
        passport: 'B87654321',
        nit: '123456789',
        address: '456 Another St',
        status: true
      };
      const mockResponse = { success: true };

      service.addClient(clientData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${API_URL_CUSTOMER}/createa`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(clientData);
      req.flush(mockResponse);
    });
  });

  describe('updateClient', () => {
    it('should update a client', () => {
      const id = 1;
      const clientData = {
        name: 'Updated Client',
        dpi: '123456789',
        passport: 'A12345678',
        nit: '987654321',
        address: '123 Main St',
        status: true
      };
      const mockResponse = { success: true };

      service.updateClient(id, clientData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${API_URL_CUSTOMER}/update/${id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(clientData);
      req.flush(mockResponse);
    });
  });

  describe('changeStatus', () => {
    it('should change the status of a client', () => {
      const id = 1;
      const mockResponse = { success: true };

      service.changeStatus(id).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${API_URL_CUSTOMER}/toggle-status/${id}`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockResponse);
    });
  });
});
