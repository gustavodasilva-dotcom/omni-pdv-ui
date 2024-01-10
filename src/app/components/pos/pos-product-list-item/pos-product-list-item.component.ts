import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pos-product-list-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pos-product-list-item.component.html',
  styleUrl: './pos-product-list-item.component.css'
})
export class PosProductListItemComponent implements OnChanges {
  @Input() productOrder: number;
  @Input() productBarcode: string | undefined;
  @Input() productName: string | undefined;
  @Input() itemQuantity: number;
  @Input() unityPrice: number;
  @Input() wholePrice: number;
  @Input() itemDeleted: boolean = false;
  
  ngOnChanges(_changes: SimpleChanges): void {}

  public deleteItem() {
    throw new Error('Method not implemented.');
  }
}
