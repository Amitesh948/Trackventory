import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-form',
  imports: [ CommonModule,
    FormsModule,
    ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent {
  productForm: FormGroup;
  previewImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder,
   private productService: ProductService,
   private router: Router) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      stock: [null, [Validators.required, Validators.min(0)]],
      image: [null], 
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.productForm.patchValue({ image: file });

      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  logout() {
   this.router.navigate(['/login']);
   localStorage.removeItem('token');
   sessionStorage.removeItem('token');
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formData = new FormData();

      Object.keys(this.productForm.controls).forEach((key) => {
        if (key === 'image' && this.selectedFile) {
          formData.append(key, this.selectedFile);
        } else {
          formData.append(key, this.productForm.get(key)?.value);
        }
      });

      this.productService.addProduct(formData).subscribe(
        (response) => {
          console.log('Product added successfully:', response);
          alert('Product added successfully!');
          this.productForm.reset();
          this.previewImage = null;
          this.selectedFile = null;
        },
        (error) => {
          console.error('Error adding product:', error);
          alert('Failed to add product');
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
