import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../services/product/product.service';
import { Product } from '../../shared/models/product.model';

@Component({
  selector: 'app-productq-list',
  imports: [CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './productq-list.component.html',
  styleUrl: './productq-list.component.css'
})
export class ProductqListComponent {
  products: Product[] = [];
  baseUrl = 'http://localhost:5000';
  isLoading = true;
  errorMessage: string | null = null;
  private productsSub!: Subscription;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productsSub = this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load products. Please try again later.';
        this.isLoading = false;
        console.error('Error loading products:', error);
      }
    });
  }

  confirmDelete(product: Product): void {
    console.log('Confirming delete for product:', product);
    
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.productService.deleteProduct(product._id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p._id !== product._id);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product. Please try again.');
        }
      });
    }
  }
  ngOnDestroy(): void {
    if (this.productsSub) {
      this.productsSub.unsubscribe();
    }
  }
}
