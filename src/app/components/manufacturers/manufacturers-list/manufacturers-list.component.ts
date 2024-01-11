import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Manufacturer } from '../../../models/manufacturer.model';
import { ManufacturersService } from '../../../services/manufacturers/manufacturers.service';
import { AddManufacturerModalComponent } from '../add-manufacturer-modal/add-manufacturer-modal.component';

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
    this.manufacturersService.getAllManufacturers()
      .subscribe({
        next: (manufacturers) => {
          this.manufacturers = manufacturers;
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
    modalRef.componentInstance.saveCallback = () => this.loadData();
  }
}
