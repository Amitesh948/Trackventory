import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product/product.service';
import { Product } from '../../shared/models/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-product',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css'],
})
export class UpdateProductComponent implements OnInit {
  productForm: FormGroup;
  productId!: string;
  isLoading = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,

  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      stock: ['', [Validators.required, Validators.min(0)]],
      image: [''], // Optional field
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.loadProduct();
  }

  loadProduct(): void {
    this.isLoading = true;
    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        this.productForm.patchValue(product);
        this.isLoading = false;
      },
      error: (error) => {
       // this.toastr.error('Failed to load product details.', 'Error');
        this.isLoading = false;
        console.error('Error loading product:', error);
      },
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const updatedProduct: Product = { ...this.productForm.value, id: this.productId };

    this.productService.updateProduct(this.productId, updatedProduct).subscribe({
      next: () => {
        //this.toastr.success('Product updated successfully!', 'Success');
        this.router.navigate(['/products']);
      },
      error: (error) => {
        //this.toastr.error('Failed to update product.', 'Error');
        this.isSubmitting = false;
        console.error('Error updating product:', error);
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['home/add-product']);
  }
}