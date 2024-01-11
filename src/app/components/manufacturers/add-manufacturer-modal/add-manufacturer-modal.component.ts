import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ManufacturersService } from '../../../services/manufacturers/manufacturers.service';
import SwalToast from '../../../libs/swal/SwalToast';

@Component({
  selector: 'app-add-manufacturer-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './add-manufacturer-modal.component.html',
  styleUrl: './add-manufacturer-modal.component.css'
})
export class AddManufacturerModalComponent {
  saveCallback: Function = () => { };
  
  manufacturerRequest = {
    name: '',
    crn: '',
    active: true
  };

  constructor(
    public activeModal: NgbActiveModal,
    private manufacturersService: ManufacturersService
  ) { }

  addManufacturer() {
    this.manufacturersService.addManufacturer(this.manufacturerRequest)
      .subscribe({
        next: () => {
          SwalToast.fire({
            icon: 'success',
            title: 'Manufacturer added successfully'
          });

          this.activeModal.close();
          this.saveCallback();
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
