import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Manufacturer } from '../../../models/manufacturer.model';
import { ManufacturersService } from '../../../services/manufacturers/manufacturers.service';
import { ProductsService } from '../../../services/products/products.service';
import SwalToast from '../../../libs/swal/SwalToast';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit {
  manufacturers: Manufacturer[] = [];

  productRequest = {
    name: '',
    description: '',
    wholesale_price: 0,
    retail_price: 0,
    barcode: '',
    manufacturer_id: '',
    active: true
  };

  constructor(
    private router: Router,
    private productsService: ProductsService,
    private manufacturersService: ManufacturersService
  ) { }

  ngOnInit(): void {
    this.manufacturersService.getAllManufacturers()
      .subscribe({
        next: (manufacturers) => {
          this.manufacturers = manufacturers;
        },
        error: (response) => {
          console.error(response);
        }
      });
  }

  addProduct() {
    this.productsService.addProduct(this.productRequest)
      .subscribe({
        next: async () => {
          await SwalToast.fire({
            icon: 'success',
            title: 'Product added successfully'
          });
          
          this.router.navigate(['/products']);
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
