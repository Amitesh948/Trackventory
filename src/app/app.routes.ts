import { ProductFormComponent } from './modules/product/product-form/product-form.component';
import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './modules/shared/page-not-found/page-not-found/page-not-found.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { LayoutComponent } from './modules/core/layout/layout.component';
import { ProductqListComponent } from './modules/product/productq-list/productq-list.component';
import { UpdateProductComponent } from './modules/product/update-product/update-product.component';
import { AuthGuard } from './guards/authguard/auth.guard';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: LayoutComponent,
    children: [
      { path: 'add-product', component: ProductFormComponent },
      { path: 'products', component: ProductqListComponent },
      { path: 'update-product/:id', component: UpdateProductComponent },
      { path: 'delete-product', component: ProductFormComponent }, 
    ], canActivate: [AuthGuard]
  },
  { path: '**', component: PageNotFoundComponent },
];


