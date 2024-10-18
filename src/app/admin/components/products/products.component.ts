import { Component, ViewChild } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MyErrorStateMatcher } from 'src/app/shared/utilities/error-state-matcher.utility';
import { Product } from '../../utilities/models/product.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';
import { ProductsService } from '../../services/products.service';
import { MatDialog } from '@angular/material/dialog';
import { Form, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  matcher = new MyErrorStateMatcher();
  @BlockUI() blockUI!: NgBlockUI;
  public options = {
    timeOut: 3000,
    showProgressBar: false,
    pauseOnHover: true,
    clickToClose: true
  };

  products: Product[] = [];
  filteredProducts: MatTableDataSource<Product> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  productForm!: FormGroup;
  searhQuery = '';
  pageSize = 10;
  currentPage = 0;
  totalClients = 0;
  isEditing: boolean = false;
  selectedProductId!: number;
  productStatus!: boolean;

  constructor(
    private readonly _notifications: NotificationsService,
    private readonly translate: TranslateService,
    private readonly productsService: ProductsService,
    private readonly dialog: MatDialog,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.blockUI.start();
    this.productsService
      .getProducts(this.currentPage, this.pageSize)
      .subscribe({
        next: products => {
          if (products.object) {
            this.products = products.object;
            this.filteredProducts = new MatTableDataSource(this.products);
            this.currentPage = products.currentPage;
            this.totalClients = products.totalElements;
          }
          this.blockUI.stop();
        },
        error: error => {
          this.blockUI.stop();
          this._notifications.error('Error', error.error.message, this.options);
        }
      });
  }
}
