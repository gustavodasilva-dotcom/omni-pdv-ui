import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Product } from '../../../models/product.model';
import { ProductsService } from '../../../services/products/products.service';
import { AddProductModalComponent } from '../add-product-modal/add-product-modal.component';
import { SwalToast } from '../../../libs/swal';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    CommonModule,
    NgbTooltip
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private modalService: NgbModal,
    private productsService: ProductsService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.productsService.getAll()
      .subscribe({
        next: (result) => {
          this.products = result?.data;
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

  openModal() {
    const modalRef = this.modalService.open(AddProductModalComponent, {
      size: 'lg',
      centered: true,
    });    
    modalRef.componentInstance.prepare({
      callbacks: {
        save: () => this.loadData()
      }
    });
  }

  updateProduct(product: Product) {
    const modalRef = this.modalService.open(AddProductModalComponent, {
      size: 'lg',
      centered: true,
    });    
    modalRef.componentInstance.prepare({
      id: product.id,
      model: {
        name: product.name,
        description: product.description,
        wholesale_price: product.wholesale_price,
        retail_price: product.retail_price,
        barcode: product.barcode,
        manufacturer_id: product.manufacturer.id,
        active: product.active
      },
      callbacks: {
        save: () => this.loadData()
      }
    });
  }

  async deleteProduct(product: Product) {
    const dialog = await Swal.fire({
      title: 'Wait...',
      icon: 'warning',
      text: 'Do you really want to delete this product?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    });

    if (!dialog.isConfirmed)
      return;

    this.productsService.delete(product.id)
      .subscribe({
        next: () => {
          SwalToast.fire({
            icon: 'success',
            title: 'Product deleted successfully'
          });
          
          this.loadData();
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
