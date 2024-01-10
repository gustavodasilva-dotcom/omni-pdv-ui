import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ManufacturersService } from '../../../services/manufacturers/manufacturers.service';
import SwalToast from '../../../libs/swal/SwalToast';

@Component({
  selector: 'app-add-manufacturer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './add-manufacturer.component.html',
  styleUrl: './add-manufacturer.component.css'
})
export class AddManufacturerComponent {
  manufacturerRequest = {
    name: '',
    crn: '',
    active: true
  };

  constructor(
    private router: Router,
    private manufacturersService: ManufacturersService
  ) { }

  addManufacturer() {
    this.manufacturersService.addManufacturer(this.manufacturerRequest)
      .subscribe({
        next: async () => {
          await SwalToast.fire({
            icon: 'success',
            title: 'Manufacturer added successfully'
          });
          
          this.router.navigate(['/manufacturers']);
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
