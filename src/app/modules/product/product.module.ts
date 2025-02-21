import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductqListComponent } from './productq-list/productq-list.component';

const routes: Routes = [
  { path: 'add-product', component: ProductFormComponent },
  { path: '', component: ProductqListComponent }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule]
})
export class ProductModule { }
