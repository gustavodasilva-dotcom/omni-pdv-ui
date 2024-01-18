import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { Sale } from '../../../models/sale.model';
import { SaleProduct } from '../../../models/sale-product.model';
import { SalesService } from '../../../services/sales/sales.service';
import { ProductsService } from '../../../services/products/products.service';
import { PosProductListItemComponent } from '../pos-product-list-item/pos-product-list-item.component';
import { SwalToast } from '../../../libs/swal';
import { PosDiscountModalComponent } from '../pos-discount-modal/pos-discount-modal.component';
import { SaleStatusEnum } from '../../../models/enums/sale-status.enum';
import { PosClientModalComponent } from '../pos-client-modal/pos-client-modal.component';
import { AddProductRequestToSale } from '../../../services/sales/models/add-product-to-sale.model';
import { environment } from '../../../../environments/environment.development';
import { Guid } from 'guid-typescript';

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
  sale: Sale | null;  
  addProjectToSaleRequest: AddProductRequestToSale;
  saleStatusEnum: typeof SaleStatusEnum = SaleStatusEnum;
  
  @ViewChild('inputBarcodeSearch') inputBarcodeSearch: ElementRef<HTMLInputElement>;
  @ViewChild('inputProductPrice') inputProductPrice: ElementRef<HTMLInputElement>;
  @ViewChild('inputProductQuantity') inputProductQuantity: ElementRef<HTMLInputElement>;
  @ViewChild('inputProductTotalPrice') inputProductTotalPrice: ElementRef<HTMLInputElement>;
  @ViewChild('saleProductContainer', { read: ViewContainerRef }) saleProductContainer: ViewContainerRef;

  constructor(
    private salesService: SalesService,
    private productsService: ProductsService,
    private modalService: NgbModal,
    private hotkeysService: HotkeysService
  ) {
    this.hotkeysService.add(
      [
        new Hotkey(
          'f1',
          (): boolean => {
            this.openDiscountModal()
            return false;
          },
          ['INPUT', 'TEXTAREA', 'SELECT'],
          'open discount modal'
        ),
        new Hotkey(
          'f2',
          (): boolean => {
            this.openClientModal()
            return false;
          },
          ['INPUT', 'TEXTAREA', 'SELECT'],
          'open client modal'
        ),
        new Hotkey(
          'f3',
          (): boolean => {
            this.changeSaleStatus(SaleStatusEnum.Closed);
            return false;
          },
          ['INPUT', 'TEXTAREA', 'SELECT'],
          'finish sale'
        ),
        new Hotkey(
          'f4',
          (): boolean => {
            this.changeSaleStatus(SaleStatusEnum.Cancelled);
            return false;
          },
          ['INPUT', 'TEXTAREA', 'SELECT'],
          'cancel sale'
        )
      ]
    );

    this.addProjectToSaleRequest = {
      barcode: '',
      quantity: 0
    };
  }

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
    this.salesService.getOpenedSale()
      .subscribe({
        next: (result) => {
          this.sale = result?.data;
          this._renderSaleProductsList();
        },
        error: (response: HttpErrorResponse | Error) => {
          var message: string = response?.message ??
            'An error occurred while communicating with the API';
          
          if (response instanceof HttpErrorResponse)
              message = response.error?.data;

          Swal.fire({
            title: 'Request error',
            text: message,
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
        next: (result) => {
          SwalToast.fire({
            icon: 'success',
            title: 'Product removed from list successfully'
          });

          this.sale = result.data;
          this._setSalesValues();
        },
        error: (response: HttpErrorResponse | Error) => {
          var message: string = response?.message ??
            'An error occurred while communicating with the API';
          
          if (response instanceof HttpErrorResponse)
              message = response.error?.data;

          Swal.fire({
            title: 'Request error',
            text: message,
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
        next: (result) => {
          SwalToast.fire({
            icon: 'success',
            title: 'Product added successfully to the list'
          });

          this.sale = result.data;
          this._setSalesValues();

          this.addProjectToSaleRequest = {
            barcode: '',
            quantity: 0
          };

          this.inputProductPrice.nativeElement.value = '';
          this.inputProductTotalPrice.nativeElement.value = '';
          
          this.inputBarcodeSearch.nativeElement.focus();
        },
        error: (response: HttpErrorResponse | Error) => {
          var message: string = response?.message ??
            'An error occurred while communicating with the API';
          
          if (response instanceof HttpErrorResponse)
              message = response.error?.data;

          Swal.fire({
            title: 'Request error',
            text: message,
            icon: 'error'
          });
        }
      });
  }

  searchProduct(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();

      const barcode = (e.target as HTMLInputElement)?.value;

      if (!barcode) {
        Swal.fire({
          title: 'Invalid operation',
          text: 'Search argument cannot be empty',
          icon: 'error'
        });

        return;
      }
      
      this.productsService.getProductByBarcode(barcode)
        .subscribe({
          next: (result) => {
            const data = result.data;

            this.inputProductPrice.nativeElement.value = data.retail_price.toLocaleString('en', {
              minimumFractionDigits: 2
            });

            this.addProjectToSaleRequest.quantity = 1;
            
            this.calculateTotalPrice();
            this.inputProductQuantity.nativeElement.focus();
          },
          error: (response: HttpErrorResponse | Error) => {
            var message: string = response?.message ??
              'An error occurred while communicating with the API';
          
            if (response instanceof HttpErrorResponse)
              message = response.error?.data;

            Swal.fire({
              title: 'Request error',
              text: message,
              icon: 'error'
            });
          }
        });
    }
  }

  private isSaleOpened() {
    if (!this.sale) {
      Swal.fire({
        title: 'Invalid operation',
        text: 'For this operation, there has to be an open sale',
        icon: 'error'
      });

      return false;
    }

    return true;
  }

  private async handleSaleReceipt() {
    var emailToReceive = this.sale?.client.email;

    const emptyEmailOrDefaultClient = !emailToReceive
      || this.sale?.client.ssn === environment.defaultClient.ssn;

    if (emptyEmailOrDefaultClient) {
      const emailForm = await Swal.fire({
        title: 'Send receipt to email',
        input: 'email',
        inputLabel: 'Please, inform the email that you wish to receive the receipt',
        confirmButtonText: 'Send',
        cancelButtonText: 'Cancel',
        showCancelButton: true,
        reverseButtons: true,
        allowOutsideClick: false,
        allowEscapeKey: false
      });

      if (!emailForm.isConfirmed)
        return;

      emailToReceive = emailForm?.value;
    }

    this.salesService.sendReceiptToEmail({
      sale_id: this.sale?.id ?? Guid.parse(Guid.EMPTY),
      email: emailToReceive
    })
      .subscribe({
        next: () => {
          SwalToast.fire({
            icon: 'success',
            title: 'Receipt sent to email successfully'
          });
        },
        error: (response: HttpErrorResponse | Error) => {
          var message: string = response?.message ??
            'An error occurred while communicating with the API';
          
          if (response instanceof HttpErrorResponse)
              message = response.error?.data;

          Swal.fire({
            title: 'Request error',
            text: message,
            icon: 'error'
          });
        }
      });
  }

  openDiscountModal() {
    if (!this.isSaleOpened())
      return;

    const modalRef = this.modalService.open(PosDiscountModalComponent, {
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.prepare({
      callbacks: {
        save: () => {
          SwalToast.fire({
            icon: 'success',
            title: 'Discount added successfully'
          });
          
          this._setSalesValues();
        }
      }
    });
  }

  openClientModal() {
    if (!this.isSaleOpened())
      return;

    const modalRef = this.modalService.open(PosClientModalComponent, {
      size: 'md',
      centered: true
    });
    modalRef.componentInstance.prepare({
      model: {
        client_id: this.sale?.client.id
      },
      callbacks: {
        save: () => {
          SwalToast.fire({
            icon: 'success',
            title: 'Client added successfully'
          });
          
          this._setSalesValues();
        }
      }
    });
  }
  
  async changeSaleStatus(status: SaleStatusEnum) {
    if (!this.isSaleOpened())
      return;

    const dialogStatus = await Swal.fire({
      title: 'Wait...',
      icon: 'warning',
      text: `Do you really want to ${status === SaleStatusEnum.Closed ? 'finish' : 'cancel'} this sale?`,
      showCancelButton: true,
      confirmButtonText: 'Yes',
    });

    if (!dialogStatus.isConfirmed)
      return;

    const dialogReceipt = await Swal.fire({
      title: 'Before we continue...',
      icon: 'question',
      text: 'Would you want to send the sale receipt to an email?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    });

    this.salesService.changeOpenedSaleStatus({ status })
      .subscribe({
        next: async () => {         
          if (dialogReceipt.isConfirmed)
            await this.handleSaleReceipt();
          
          this._setSalesValues();
          
          SwalToast.fire({
            icon: 'success',
            title: `Sale ${status === SaleStatusEnum.Closed ? 'finished' : 'cancelled'} successfully`
          });
        },
        error: (response: HttpErrorResponse | Error) => {
          var message: string = response?.message ??
            'An error occurred while communicating with the API';
          
          if (response instanceof HttpErrorResponse)
              message = response.error?.data;

          Swal.fire({
            title: 'Request error',
            text: message,
            icon: 'error'
          });
        }
      });
  }
}
