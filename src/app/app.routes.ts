import { Routes } from '@angular/router';
import { PosIndexComponent } from './components/pos/pos-index/pos-index.component';
import { ProductsListComponent } from './components/products/products-list/products-list.component';
import { ManufacturersListComponent } from './components/manufacturers/manufacturers-list/manufacturers-list.component';

export const routes: Routes = [
  {
    path: 'pos',
    component: PosIndexComponent
  },
  {
    path: 'manufacturers',
    component: ManufacturersListComponent
  },
  {
    path: 'products',
    component: ProductsListComponent
  }
];
