import { Routes } from '@angular/router';
import { PosIndexComponent } from './components/pos/pos-index/pos-index.component';
import { ProductsListComponent } from './components/products/products-list/products-list.component';
import { ManufacturersListComponent } from './components/manufacturers/manufacturers-list/manufacturers-list.component';
import { ClientsListComponent } from './components/clients/clients-list/clients-list.component';
import { HomeIndexComponent } from './components/home/home-index/home-index.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeIndexComponent
  },
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
  },
  {
    path: 'clients',
    component: ClientsListComponent
  }
];
