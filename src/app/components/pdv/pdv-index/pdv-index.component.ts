import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Sale } from '../../../models/sale.model';
import { SalesService } from '../../../services/sales/sales.service';
import { ProductsService } from '../../../services/products/products.service';

@Component({
  selector: 'app-pdv-index',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './pdv-index.component.html',
  styleUrl: './pdv-index.component.css'
})
export class PdvIndexComponent {
  @ViewChild('inputBarcodeSearch') inputBarcodeSearch: ElementRef<HTMLInputElement>;
  @ViewChild('inputProductPrice') inputProductPrice: ElementRef<HTMLInputElement>;
  @ViewChild('inputProductQuantity') inputProductQuantity: ElementRef<HTMLInputElement>;
  @ViewChild('inputProductTotalPrice') inputProductTotalPrice: ElementRef<HTMLInputElement>;

  sale: Sale | undefined;

  addProjectToSaleRequest = {
    barcode: '',
    quantity: 0
  };

  constructor(
    private salesService: SalesService,
    private productsService: ProductsService
  ) { }

  addProduct() {
    this.salesService.addProductToSale(this.addProjectToSaleRequest)
      .subscribe({
        next: (sale) => {
          this.sale = sale;

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

  calculateTotalPrice() {
    const quantity = +this.inputProductQuantity.nativeElement.value;
    const price = +this.inputProductPrice.nativeElement.value;
    this.inputProductTotalPrice.nativeElement.value = (price * quantity).toString();
  }

  searchProduct($event: KeyboardEvent) {
    if ($event.key === 'Enter') {
      $event.preventDefault();
      const _barcode = ($event.target as HTMLInputElement)?.value;
      this.productsService.getProductByBarcode(_barcode)
        .subscribe({
          next: (product) => {
            this.inputProductPrice.nativeElement.value = product.retail_price.toString();
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
