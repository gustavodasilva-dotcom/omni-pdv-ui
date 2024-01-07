import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Manufacturer } from '../../../models/manufacturer.model';
import { ManufacturersService } from '../../../services/manufacturers/manufacturers.service';

@Component({
  selector: 'app-manufacturers-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './manufacturers-list.component.html',
  styleUrl: './manufacturers-list.component.css'
})
export class ManufacturersListComponent implements OnInit {
  manufacturers: Manufacturer[] = [];

  constructor(private manufacturersService: ManufacturersService) { }

  ngOnInit(): void {
    this.manufacturersService.getAllManufacturers()
      .subscribe({
        next: (manufacturers) => {
          this.manufacturers = manufacturers;
        },
        error: (response: HttpErrorResponse | Error) => {
          Swal.fire({
            title: "Request error",
            text: response?.message,
            icon: "error"
          });
        }
      });
  }
}
