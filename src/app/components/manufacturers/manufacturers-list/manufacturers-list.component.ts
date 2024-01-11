import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Manufacturer } from '../../../models/manufacturer.model';
import { ManufacturersService } from '../../../services/manufacturers/manufacturers.service';
import { AddManufacturerModalComponent } from '../add-manufacturer-modal/add-manufacturer-modal.component';
import SwalToast from '../../../libs/swal/SwalToast';

@Component({
  selector: 'app-manufacturers-list',
  standalone: true,
  imports: [
    CommonModule,
    NgbTooltip
  ],
  templateUrl: './manufacturers-list.component.html',
  styleUrl: './manufacturers-list.component.css'
})
export class ManufacturersListComponent implements OnInit {
  manufacturers: Manufacturer[] = [];

  constructor(
    private modalService: NgbModal,
    private manufacturersService: ManufacturersService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.manufacturersService.getAll()
      .subscribe({
        next: (result) => {
          this.manufacturers = result.data;
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
    const modalRef = this.modalService.open(AddManufacturerModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.prepare({
      callbacks: {
        save: () => this.loadData()
      }
    });
  }

  update(manufacturer: Manufacturer) {
    const modalRef = this.modalService.open(AddManufacturerModalComponent, {
      centered: true,
    });    
    modalRef.componentInstance.prepare({
      id: manufacturer.id,
      model: {
        name: manufacturer.name,
        crn: manufacturer.crn,
        active: manufacturer.active
      },
      callbacks: {
        save: () => this.loadData()
      }
    });
  }

  async delete(manufacturer: Manufacturer) {
    const dialog = await Swal.fire({
      title: 'Wait...',
      icon: 'warning',
      text: 'Do you really want to delete this manufacturer?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    });

    if (!dialog.isConfirmed)
      return;

    this.manufacturersService.delete(manufacturer.id)
      .subscribe({
        next: () => {
          SwalToast.fire({
            icon: 'success',
            title: 'Manufacturer deleted successfully'
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
