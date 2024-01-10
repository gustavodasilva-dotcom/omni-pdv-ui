import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Sale } from '../../../models/sale.model';
import { SaleProduct } from '../../../models/sale-product.model';
import { SalesService } from '../../../services/sales/sales.service';
import { ProductsService } from '../../../services/products/products.service';
import { PdvProductListItemComponent } from '../pdv-product-list-item/pdv-product-list-item.component';
import SwalToast from '../../../libs/swal/SwalToast';

@Component({
  selector: 'app-pdv-index',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './pdv-index.component.html',
  styleUrl: './pdv-index.component.css'
})
export class PdvIndexComponent implements OnInit {
  @ViewChild('inputBarcodeSearch') inputBarcodeSearch: ElementRef<HTMLInputElement>;
  @ViewChild('inputProductPrice') inputProductPrice: ElementRef<HTMLInputElement>;
  @ViewChild('inputProductQuantity') inputProductQuantity: ElementRef<HTMLInputElement>;
  @ViewChild('inputProductTotalPrice') inputProductTotalPrice: ElementRef<HTMLInputElement>;
  @ViewChild('saleProductContainer', { read: ViewContainerRef }) saleProductContainer: ViewContainerRef;
  @ViewChild('spnTotalItems') spnTotalItems: ElementRef<HTMLInputElement>;
  @ViewChild('spnTotalVolumes') spnTotalVolumes: ElementRef<HTMLInputElement>;
  @ViewChild('spnDiscount') spnDiscount: ElementRef<HTMLInputElement>;
  @ViewChild('spnSubtotal') spnSubtotal: ElementRef<HTMLInputElement>;

  sale: Sale | undefined;

  addProjectToSaleRequest = {
    barcode: '',
    quantity: 0
  };

  constructor(
    private salesService: SalesService,
    private productsService: ProductsService
  ) { }

  ngOnInit(): void {
    this._setSalesValues();
  }

  private _renderSaleProductsList() {
    this.saleProductContainer.clear();

    this.sale?.products.sort(p => p.order).map((product) => {
      const itemComponent = this.saleProductContainer.createComponent(PdvProductListItemComponent);

      itemComponent.setInput('productOrder', product.order);
      itemComponent.setInput('productBarcode', product.product.barcode);
      itemComponent.setInput('productName', product.product.name);

      if (product.deleted)
        itemComponent.setInput('itemDeleted', product.deleted);
      else {
        itemComponent.setInput('itemQuantity', product.quantity);
        itemComponent.setInput('unityPrice', product.product.retail_price.toLocaleString('us', { minimumFractionDigits: 2, style: 'currency', currency: 'USD' }));
        itemComponent.setInput('wholePrice', (product.quantity * product.product.retail_price).toLocaleString('us', { minimumFractionDigits: 2, style: 'currency', currency: 'USD' }));
        itemComponent.instance.deleteItem = () => this._deleteProductItem(product);
      }
    });
  }

  private _setFooterTotals() {
    const sale = this.sale;

    this.spnTotalItems.nativeElement.textContent = (sale?.products.filter(p => !p.deleted).length ?? 0).toString();
    this.spnTotalVolumes.nativeElement.textContent = (sale?.products.filter(p => !p.deleted).reduce((acc, prod) => acc + prod.quantity, 0) ?? 0).toString();
    this.spnDiscount.nativeElement.textContent = (sale?.discount?.value ?? 0).toLocaleString('us', { minimumFractionDigits: 2, style: 'currency', currency: 'USD' });
    this.spnSubtotal.nativeElement.textContent = (sale?.subtotal ?? 0).toLocaleString('us', { minimumFractionDigits: 2, style: 'currency', currency: 'USD' });
  }

  private _setSalesValues() {
    this.salesService.getOpenSale()
      .subscribe({
        next: (sale: Sale) => {
          this.sale = sale;
          this._renderSaleProductsList();
          this._setFooterTotals();
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

  public calculateTotalPrice() {
    const quantity = +this.inputProductQuantity.nativeElement.value;
    const price = +this.inputProductPrice.nativeElement.value;

    this.inputProductTotalPrice.nativeElement.value = (price * quantity).toLocaleString('us', { minimumFractionDigits: 2 });
  }

  public addProduct() {
    this.salesService.addProductToSale(this.addProjectToSaleRequest)
      .subscribe({
        next: (sale) => {
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

  public searchProduct($event: KeyboardEvent) {
    if ($event.key === 'Enter') {
      $event.preventDefault();
      const _barcode = ($event.target as HTMLInputElement)?.value;
      this.productsService.getProductByBarcode(_barcode)
        .subscribe({
          next: (product) => {
            this.inputProductPrice.nativeElement.value = product.retail_price.toLocaleString('us', { minimumFractionDigits: 2 });
            this.inputProductQuantity.nativeElement.focus();            
            this.calculateTotalPrice();
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
}
