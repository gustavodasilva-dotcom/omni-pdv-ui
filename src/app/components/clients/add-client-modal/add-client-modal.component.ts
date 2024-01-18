import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ClientsService } from '../../../services/clients/clients.service';
import { DefaultOptions } from './models/default-options.model';
import { JsonResult } from '../../../models/http/json-result.model';
import { Client } from '../../../models/client.model';
import { SwalToast } from '../../../libs/swal';
import { getDateFromISOString } from '../../../libs/date';

@Component({
  selector: 'app-add-client-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './add-client-modal.component.html',
  styleUrl: './add-client-modal.component.css'
})
export class AddClientModalComponent {
  options: DefaultOptions;

  constructor(
    public activeModal: NgbActiveModal,
    private clientsService: ClientsService
  ) { }

  prepare(options: DefaultOptions) {
    const defaultOptions: DefaultOptions = {
      id: Guid.EMPTY,
      model: {
        name: '',
        ssn: '',
        birthday: getDateFromISOString(),
        email: '',
        active: true
      },
      callbacks: {
        save: (_data: Client) => {},
        cancel: () => {}
      }
    };
    this.options = { ...defaultOptions, ...options };

    this.options.model.birthday = getDateFromISOString(this.options.model.birthday);
  }

  saveClient() {
    var request: Observable<JsonResult<Client>>;
    var message: string;

    if (this.options.id === Guid.EMPTY) {
      request = this.clientsService.add(this.options.model);
      message = 'Client added successfully';
    } else {
      request = this.clientsService.update(this.options.id, this.options.model);
      message = 'Client updated successfully';
    }

    request.subscribe({
      next: (result) => {
        SwalToast.fire({
          icon: 'success',
          title: message
        });

        this.activeModal.close();
        this.options.callbacks.save(result.data);
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
