import { Component, ViewChild } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MyErrorStateMatcher } from 'src/app/shared/utilities/error.utility';
import { Product } from '../../utilities/models/product.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';
import { ProductsService } from '../../services/products.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

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
  }

  products: Product[] = [];
  filteredProducts: MatTableDataSource<Product> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  productForm!: FormGroup;
  searhQuery = '';
  pageSize = 10;
  currentPage = 0;
  totalProducts = 0;
  isEditing: boolean = false;
  selectedProductId!: number;
  productStatus!: boolean;
  searchForm: FormGroup;

  constructor(
    private readonly _notifications: NotificationsService,
    private readonly translate: TranslateService,
    private readonly productsService: ProductsService,
    private readonly dialog: MatDialog,
    private readonly fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      price: ['', [Validators.required]],
      stock: ['', [Validators.required]],
      deliveryTime: ['', [Validators.required]],
      status: [true, [Validators.required]],
      entryDate: ['', [Validators.required]],
      expirateDate: ['', [Validators.required]],
    });
    this.searchForm = this.fb.group({
      search: ['', []]
    });
  }

  ngOnInit(): void {
    this.fetchProducts();
  }

  searchProduct(): void {
    const search = this.searchForm.value.search?.trim();
    if (search) {
      this.fetchProductByName();
    } else {
      this.fetchProducts();
    }
  }

  fetchProductByName(): void {
    const search = { name: this.searchForm.value.search };
    this.blockUI.start();
    this.productsService.getProductByName(search, this.currentPage, this.pageSize).subscribe({
      next: products => {
        if (products.object) {
          this.products = products.object;
          this.filteredProducts = new MatTableDataSource(this.products);
          this.currentPage = products.currentPage;
          this.totalProducts = products.totalElements;
        }
        this.blockUI.stop();
      }, error: error => {
        this._notifications.error(
          this.translate.instant('Error'),
          error.error.message,
          this.options
        );
        this.blockUI.stop();
      }
    });
  }

  fetchProductsDetails(productsId: number): void {
    this.blockUI.start();
    this.productsService.getProductById(productsId).subscribe({
      next: product => {
        if (product.object) {
          this.productForm.patchValue({
            code: product.object.code,
            name: product.object.name,
            description: product.object.description,
            companyName: product.object.companyOrBrandName,
            price: product.object.price,
            stock: product.object.stock,
            deliveryTime: product.object.delivery_time,
            status: product.object.status,
            entryDate: product.object.entryDate,
            expirateDate: product.object.expirationDate
          });
          this.selectedProductId = product.object.productsId;
          this.productStatus = product.object.status;
          this.fetchProducts();
          this.isEditing = true;
          this.productForm.markAsPristine();
          this.blockUI.stop();
        }
      }, error: error => {
        this.blockUI.stop();
        this._notifications.error(
          this.translate.instant('Error'),
          error.error.message,
          this.options
        );
      }
    })
  }

  fetchProducts(): void {
    this.blockUI.start();
    this.productsService.getProducts(this.currentPage, this.pageSize).subscribe({
      next: products => {
        if (products.object) {
          this.products = products.object;
          this.filteredProducts = new MatTableDataSource(this.products);
          this.currentPage = products.currentPage;
          this.totalProducts = products.totalElements;
        }
        this.blockUI.stop();
      }, error: error => {
        this._notifications.error(
          this.translate.instant('Error'),
          error.error.message,
          this.options
        );
        this.blockUI.stop();
      }
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchProducts();
  }

  addProduct(): void {
    if (this.productForm.valid) {
      const productData = {
        productId: 0,
        code: this.productForm.value.code,
        name: this.productForm.value.name,
        delivery_time: this.productForm.value.deliveryTime,
        description: this.productForm.value.description,
        price: this.productForm.value.price,
        status: this.productForm.value.status,
        companyOrBrandName: this.productForm.value.companyName,
        expirationDate: this.productForm.value.expirateDate,
        entryDate: this.productForm.value.entryDate,
        stock: this.productForm.value.stock
      }
      this.blockUI.start();
      this.productsService.addProduct(productData).subscribe({
        next: response => {
          this._notifications.success(
            this.translate.instant('Success'),
            this.translate.instant('PRODUCTS.NOTIFICATIONS.PRODUCT_CREATED_DESC'),
          )
          this.fetchProducts();
          this.productForm.reset();
        },
        error: error => {
          this._notifications.error(
            this.translate.instant('Error'),
            error.error.message,
            this.options
          );
          this.blockUI.stop();
        }
      });
    } else {
      this._notifications.error(
        this.translate.instant('Error'),
        this.translate.instant('PRODUCTS.NOTIFICATIONS.INVALID_FORM_DESC'),
        this.options
      );
    }
  }

  changeStatus(productId: number): void {
    this.productsService.changeStatus(productId).subscribe({
      next: response => {
        this._notifications.success(
          this.translate.instant('PRODUCTS.NOTIFICATIONS.STATUS_SUCCESS'),
        );
        this.fetchProducts();
        this.fetchProductsDetails(productId);
      },
      error: error => {
        console.error('Error changing status:', error);
        this._notifications.error(
          this.translate.instant('PRODUCTS.NOTIFICATIONS.STATUS_FAILURE'),
          error.error.message,
          this.options
        );
      }
    });
  }

  updateProduct(): void {
    if (this.productForm.valid) {
      const updateProductData = {
        code: this.productForm.value.code,
        name: this.productForm.value.name,
        delivery_time: this.productForm.value.deliveryTime,
        description: this.productForm.value.description,
        price: this.productForm.value.price,
        status: this.productForm.value.status,
        companyOrBrandName: this.productForm.value.companyName,
        expirationDate: this.productForm.value.expirateDate,
        entryDate: this.productForm.value.entryDate,
        stock: this.productForm.value.stock
      }
      this.productsService.updateProduct(this.selectedProductId, updateProductData).subscribe({
        next: response => {
          this._notifications.success(
            this.translate.instant('Success'),
            this.translate.instant('PRODUCTS.NOTIFICATIONS.UPDATE_SUCCESS'),
          )
          this.fetchProducts();
          this.productForm.reset();
          this.isEditing = false;
        },
        error: error => {
          this._notifications.error(
            this.translate.instant('Error'),
            error.error.message,
            this.options
          );
          this.blockUI.stop();
        }
      });
    }
  }

  confirmDeleteProduct(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.instant('PRODUCTS.DIALOG.TITLE'),
        message: this.translate.instant('PRODUCTS.DIALOG.MESSAGE', { productName: product.name })
      }
    });
    this.productForm.reset();
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteProduct(product.productsId);
      }
    });
  }

  deleteProduct(productId: number): void {
    this.blockUI.start(
      this.translate.instant('PRODUCTS.NOTIFICATIONS.DELETING_PRODUCT')
    );
    this.productsService.deleteProduct(productId).subscribe({
      next: response => {
        this._notifications.success(
          this.translate.instant('Success'),
          this.translate.instant('PRODUCTS.NOTIFICATIONS.PRODUCT_DELETED_DESC'),
        )
        this.fetchProducts();
        this.blockUI.stop();
        this.productForm.reset();
      },
      error: error => {
        console.error('Error deleting product:', error);
        this.blockUI.stop();
        this._notifications.error(
          this.translate.instant('Error'),
          error.error.message,
          this.options
        );
      }
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.productForm.reset();
  }

  submitProduct(): void {
    if (this.isEditing) {
      this.updateProduct();
    } else {
      this.addProduct();
    }
  }
}
