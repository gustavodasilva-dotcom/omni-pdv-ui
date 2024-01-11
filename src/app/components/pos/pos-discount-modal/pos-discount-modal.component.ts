import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { SalesService } from '../../../services/sales/sales.service';
import { DiscountTypeEnum } from '../../../models/enums/discount-type-enum';
import { DefaultOptions } from './models/default-options.model';

@Component({
  selector: 'app-pos-discount-modal',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './pos-discount-modal.component.html',
  styleUrl: './pos-discount-modal.component.css'
})
export class PosDiscountModalComponent {
  discountTypeEnum: typeof DiscountTypeEnum = DiscountTypeEnum;
  
  options: DefaultOptions;
  
  constructor(
    public activeModal: NgbActiveModal,
    private salesService: SalesService
  ) { }

  prepare(options: DefaultOptions) {
    const defaultOptions: DefaultOptions = {
      model: {
        type: DiscountTypeEnum.Monetary,
        value: 0
      },
      callbacks: {
        save: () => { },
        cancel: () => { }
      }
    };
    this.options = { ...defaultOptions, ...options };
  }

  saveDiscount() {
    if (String(this.options.model.type) === "1")
      this.options.model.type = DiscountTypeEnum.Monetary;
    if (String(this.options.model.type) === "2")
      this.options.model.type = DiscountTypeEnum.Percentage;

    this.salesService.addDiscountToSale(this.options.model)
      .subscribe({
        next: () => {
          this.options.callbacks.save();
          this.activeModal.close();
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
