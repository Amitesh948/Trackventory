// components/productq-list/productq-list.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../services/product/product.service';
import { Product } from '../../shared/models/product.model';

@Component({
  selector: 'app-productq-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './productq-list.component.html',
  styleUrls: ['./productq-list.component.css']
})
export class ProductqListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  baseUrl = 'http://localhost:5000';
  isLoading = false;
  errorMessage: string | null = null;
  private productsSub!: Subscription;
  categories: string[] = [];
  selectedCategory: string | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    const filters: { category?: string; minPrice?: number; maxPrice?: number } = {};

    if (this.selectedCategory) {
      filters.category = this.selectedCategory;
    }
    if (this.minPrice !== null) {
      filters.minPrice = this.minPrice;
    }
    if (this.maxPrice !== null) {
      filters.maxPrice = this.maxPrice;
    }

    this.productsSub = this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        if (!this.selectedCategory && this.minPrice === null && this.maxPrice === null) {
          this.categories = this.getUniqueCategories(products);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.errorMessage = 'Failed to load products.';
        this.isLoading = false;
      }
    });
  }

  getUniqueCategories(products: Product[]): string[] {
    console.log('Products:', products);
    
    return [...new Set(products.map(p => p.category))];
  }

  applyFilters(): void {
    this.isLoading = true;
  
    this.productService.getProducts(
      this.selectedCategory || undefined,
      this.minPrice ?? undefined,
      this.maxPrice ?? undefined
    ).subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.errorMessage = 'Failed to load products.';
        this.isLoading = false;
      }
    });
  }

  clearFilters(): void {
    this.selectedCategory = null;
    this.minPrice = null;
    this.maxPrice = null;
    this.applyFilters();
  }

  confirmDelete(product: Product): void {
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
