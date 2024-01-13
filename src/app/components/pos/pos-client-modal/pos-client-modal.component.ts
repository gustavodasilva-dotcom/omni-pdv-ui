import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Guid } from 'guid-typescript';
import Swal from 'sweetalert2';
import { DefaultOptions } from './models/default-options.model';
import { Client } from '../../../models/client.model';
import { ClientsService } from '../../../services/clients/clients.service';
import { AddClientModalComponent } from '../../clients/add-client-modal/add-client-modal.component';
import { SalesService } from '../../../services/sales/sales.service';

@Component({
  selector: 'app-pos-client-modal',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgbTooltipModule
  ],
  templateUrl: './pos-client-modal.component.html',
  styleUrl: './pos-client-modal.component.css'
})
export class PosClientModalComponent implements OnInit {
  clients: Client[] = [];

  options: DefaultOptions;

  emptyGuid: string = Guid.EMPTY;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private clientsService: ClientsService,
    private salesService: SalesService
  ) { }

  ngOnInit(): void {
    this._loadClients();
  }

  private _loadClients() {
    this.clientsService.getAll()
      .subscribe({
        next: (result) => {
          this.clients = result.data ?? [];
        },
        error: (response: HttpErrorResponse | Error) => {
          Swal.fire({
            title: 'Request error',
            text: response?.message,
            icon: 'error'
          });
        }
      })
  }

  prepare(options: DefaultOptions) {
    const defaultOptions: DefaultOptions = {
      model: {
        client_id: Guid.EMPTY
      },
      callbacks: {
        save: () => { },
        cancel: () => { }
      }
    };
    this.options = { ...defaultOptions, ...options };
  }

  openClientModal() {
    const modalRef = this.modalService.open(AddClientModalComponent, {
      centered: true
    });
    modalRef.componentInstance.prepare({
      callbacks: {
        save: (data: Client) => {
          this._loadClients();
          this.options.model.client_id = String(data.id);
        }
      }
    });
  }

  saveClient() {
    this.salesService.addClientToSale(this.options.model)
      .subscribe({
        next: () => {
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
