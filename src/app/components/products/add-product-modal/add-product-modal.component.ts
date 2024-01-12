import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { Manufacturer } from '../../../models/manufacturer.model';
import { ManufacturersService } from '../../../services/manufacturers/manufacturers.service';
import { ProductsService } from '../../../services/products/products.service';
import { SwalToast } from '../../../libs/swal';
import { JsonResult } from '../../../models/http/json-result.model';
import { Product } from '../../../models/product.model';
import { DefaultOptions } from './models/default-options.model';

@Component({
  selector: 'app-add-product-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './add-product-modal.component.html',
  styleUrl: './add-product-modal.component.css'
})
export class AddProductModalComponent implements OnInit {
  manufacturers: Manufacturer[] = [];

  options: DefaultOptions;

  constructor(
    public activeModal: NgbActiveModal,
    private productsService: ProductsService,
    private manufacturersService: ManufacturersService
  ) { }

  ngOnInit(): void {
    this.manufacturersService.getAll()
      .subscribe({
        next: (result) => {
          this.manufacturers = result.data;
        },
        error: (response) => {
          console.error(response);
        }
      });
  }

  prepare(options: DefaultOptions) {
    const defaultOptions: DefaultOptions = {
      id: Guid.EMPTY,
      model: {
        name: '',
        description: '',
        wholesale_price: 0,
        retail_price: 0,
        barcode: '',
        manufacturer_id: '',
        active: true
      },
      callbacks: {
        save: () => {},
        cancel: () => {}
      }
    };
    this.options = { ...defaultOptions, ...options };
  }

  saveProduct() {
    var request: Observable<JsonResult<Product>>;
    var message: string;

    if (this.options.id === Guid.EMPTY) {
      request = this.productsService.add(this.options.model);
      message = 'Product added successfully';
    } else {
      request = this.productsService.update(this.options.id, this.options.model);
      message = 'Product updated successfully';
    }
    
    request.subscribe({
      next: async () => {
        SwalToast.fire({
          icon: 'success',
          title: message
        });

        this.activeModal.close();
        this.options.callbacks.save();
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
