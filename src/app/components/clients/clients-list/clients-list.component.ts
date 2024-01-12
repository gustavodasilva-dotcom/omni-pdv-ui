import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Client } from '../../../models/client.model';
import { ClientsService } from '../../../services/clients/clients.service';
import { AddClientModalComponent } from '../add-client-modal/add-client-modal.component';
import { SwalToast } from '../../../libs/swal';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [
    CommonModule,
    NgbTooltip
  ],
  templateUrl: './clients-list.component.html',
  styleUrl: './clients-list.component.css'
})
export class ClientsListComponent implements OnInit {
  clients: Client[] = [];

  constructor(
    private modalService: NgbModal,
    private clientsService: ClientsService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.clientsService.getAll()
      .subscribe({
        next: (result) => {
          this.clients = result?.data;
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
    const modalRef = this.modalService.open(AddClientModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.prepare({
      callbacks: {
        save: () => this.loadData()
      }
    });
  }

  update(client: Client) {
    const modalRef = this.modalService.open(AddClientModalComponent, {
      centered: true,
    });    
    modalRef.componentInstance.prepare({
      id: client.id,
      model: {
        name: client.name,
        ssn: client.ssn,
        birthday: client.birthday,
        active: client.active
      },
      callbacks: {
        save: () => this.loadData()
      }
    });
  }

  async delete(client: Client) {
    const dialog = await Swal.fire({
      title: 'Wait...',
      icon: 'warning',
      text: 'Do you really want to delete this client?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    });

    if (!dialog.isConfirmed)
      return;

    this.clientsService.delete(client.id)
      .subscribe({
        next: () => {
          SwalToast.fire({
            icon: 'success',
            title: 'Client deleted successfully'
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
