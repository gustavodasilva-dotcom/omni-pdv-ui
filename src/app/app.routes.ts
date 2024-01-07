import { Routes } from '@angular/router';
import { PdvIndexComponent } from './components/pdv/pdv-index/pdv-index.component';
import { ProductsListComponent } from './components/products/products-list/products-list.component';
import { AddProductComponent } from './components/products/add-product/add-product.component';
import { ManufacturersListComponent } from './components/manufacturers/manufacturers-list/manufacturers-list.component';
import { AddManufacturerComponent } from './components/manufacturers/add-manufacturer/add-manufacturer.component';

export const routes: Routes = [
  {
    path: 'pdv',
    component: PdvIndexComponent
  },
  {
    path: 'manufacturers',
    component: ManufacturersListComponent
  },
  {
    path: 'manufacturers/add',
    component: AddManufacturerComponent
  },
  {
    path: 'products',
    component: ProductsListComponent
  },
  {
    path: 'products/add',
    component: AddProductComponent
  }
];
