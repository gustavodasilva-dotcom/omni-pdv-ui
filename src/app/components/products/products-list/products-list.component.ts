import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Product } from '../../../models/product.model';
import { ProductsService } from '../../../services/products/products.service';
import { AddProductModalComponent } from '../add-product-modal/add-product.component';

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
    this.productsService.getAllProducts()
      .subscribe({
        next: (products) => {
          this.products = products;
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
    modalRef.componentInstance.saveCallback = () => this.loadData();
  }
}
