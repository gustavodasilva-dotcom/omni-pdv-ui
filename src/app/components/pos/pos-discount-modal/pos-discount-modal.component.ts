import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { SalesService } from '../../../services/sales/sales.service';
import { DiscountTypeEnum } from '../../../models/enums/discount-type-enum';
import { Discount } from '../../../models/discount.model';
import { FormsModule } from '@angular/forms';

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
  constructor(
    public activeModal: NgbActiveModal,
    private salesService: SalesService
  ) { }

  discountTypeEnum: typeof DiscountTypeEnum = DiscountTypeEnum;

  saveCallback: Function = () => {};
  
  discountRequest: Discount = {
    type: DiscountTypeEnum.Monetary,
    value: 0
  };

  saveDiscount() {
    this.salesService.addDiscountToSale(this.discountRequest)
      .subscribe({
        next: () => {
          this.saveCallback();
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
