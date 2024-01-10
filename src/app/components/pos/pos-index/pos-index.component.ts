import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Sale } from '../../../models/sale.model';
import { SaleProduct } from '../../../models/sale-product.model';
import { SalesService } from '../../../services/sales/sales.service';
import { ProductsService } from '../../../services/products/products.service';
import { PosProductListItemComponent } from '../pos-product-list-item/pos-product-list-item.component';
import SwalToast from '../../../libs/swal/SwalToast';
import { PosDiscountModalComponent } from '../pos-discount-modal/pos-discount-modal.component';

@Component({
  selector: 'app-pos-index',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './pos-index.component.html',
  styleUrl: './pos-index.component.css'
})
export class PosIndexComponent implements OnInit {
  @ViewChild('inputBarcodeSearch') inputBarcodeSearch: ElementRef<HTMLInputElement>;
  @ViewChild('inputProductPrice') inputProductPrice: ElementRef<HTMLInputElement>;
  @ViewChild('inputProductQuantity') inputProductQuantity: ElementRef<HTMLInputElement>;
  @ViewChild('inputProductTotalPrice') inputProductTotalPrice: ElementRef<HTMLInputElement>;
  @ViewChild('saleProductContainer', { read: ViewContainerRef }) saleProductContainer: ViewContainerRef;

  sale: Sale | undefined;

  addProjectToSaleRequest = {
    barcode: '',
    quantity: 0
  };

  constructor(
    private salesService: SalesService,
    private productsService: ProductsService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this._setSalesValues();
  }

  private _renderSaleProductsList() {
    this.saleProductContainer.clear();

    this.sale?.products.sort((a, b) => b.order > a.order ? 1 : -1).map((product) => {
      const itemComponent = this.saleProductContainer.createComponent(PosProductListItemComponent);

      itemComponent.setInput('productOrder', product.order);
      itemComponent.setInput('productBarcode', product.product.barcode);
      itemComponent.setInput('productName', product.product.name);

      if (product.deleted)
        itemComponent.setInput('itemDeleted', product.deleted);
      else {
        itemComponent.setInput('itemQuantity', product.quantity);

        itemComponent.setInput('unityPrice', product.product.retail_price.toLocaleString('en', {
          minimumFractionDigits: 2,
          style: 'currency',
          currency: 'USD'
        }));
        itemComponent.setInput('wholePrice', (product.quantity * product.product.retail_price).toLocaleString('en', {
          minimumFractionDigits: 2,
          style: 'currency',
          currency: 'USD'
        }));

        itemComponent.instance.deleteItem = () => this._deleteProductItem(product);
      }
    });
  }

  private _setSalesValues() {
    this.salesService.getOpenSale()
      .subscribe({
        next: (sale: Sale) => {
          this.sale = sale;
          this._renderSaleProductsList();
        },
        error: (response: HttpErrorResponse | Error) => {
          Swal.fire({
            title: 'Request error',
            text: response?.message,
            icon: 'error'
          });
        }
      });
  }

  private async _deleteProductItem(product: SaleProduct) {
    const dialog = await Swal.fire({
      title: 'Wait...',
      icon: 'warning',
      text: 'Do you really want to delete this product from the list?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    });

    if (!dialog.isConfirmed)
      return;

    this.salesService.deleteProductFromSale(product.order)
      .subscribe({
        next: (sales) => {
          SwalToast.fire({
            icon: 'success',
            title: 'Product removed from list successfully'
          });

          this.sale = sales;
          this._setSalesValues();
        },
        error: (response: HttpErrorResponse | Error) => {
          Swal.fire({
            title: 'Request error',
            text: response?.message,
            icon: 'error'
          });
        }
      });
  }

  calculateTotalPrice() {
    const quantity = +this.inputProductQuantity.nativeElement.value;
    const price = +this.inputProductPrice.nativeElement.value;

    this.inputProductTotalPrice.nativeElement.value = (price * quantity).toLocaleString('en', {
      minimumFractionDigits: 2
    });
  }

  getTotalItems(): number {
    const totalItems = this.sale?.products.filter(p => !p.deleted).length;

    return totalItems ?? 0;
  }

  getTotalProductsVolume(): number {
    const totalVolume = this.sale?.products
      .filter(p => !p.deleted)
      .reduce((acc, prod) => acc + prod.quantity, 0);
    
    return totalVolume ?? 0;
  }

  addProduct() {
    this.salesService.addProductToSale(this.addProjectToSaleRequest)
      .subscribe({
        next: (sale) => {
          SwalToast.fire({
            icon: 'success',
            title: 'Product added successfully to the list'
          });

          this.sale = sale;
          this._setSalesValues();

          this.inputBarcodeSearch.nativeElement.value = '';
          this.inputProductPrice.nativeElement.value = '';
          this.inputProductQuantity.nativeElement.value = '';
          this.inputProductTotalPrice.nativeElement.value = '';
          
          this.inputBarcodeSearch.nativeElement.focus();
        },
        error: (response: HttpErrorResponse | Error) => {
          Swal.fire({
            title: 'Request error',
            text: response?.message,
            icon: 'error'
          });
        }
      });
  }

  searchProduct(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();

      const barcode = (e.target as HTMLInputElement)?.value;
      
      this.productsService.getProductByBarcode(barcode)
        .subscribe({
          next: (product) => {
            this.inputProductPrice.nativeElement.value = product.retail_price.toLocaleString('en', {
              minimumFractionDigits: 2
            });
            
            this.calculateTotalPrice();
            this.inputProductQuantity.nativeElement.focus();
          },
          error: (response: HttpErrorResponse | Error) => {
            Swal.fire({
              title: 'Request error',
              text: response?.message,
              icon: 'error'
            });
          }
        });
    }
  }

  openDiscountModal() {
    const modalRef = this.modalService.open(PosDiscountModalComponent, {
      size: 'lg',
      centered: true,
    });

    modalRef.componentInstance.saveCallback = () => {
      SwalToast.fire({
        icon: 'success',
        title: 'Discount added successfully'
      });
      
      this._setSalesValues();
    }
  }
}
