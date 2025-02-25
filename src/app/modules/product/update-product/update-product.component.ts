
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, startWith, map } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../../services/product/product.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';  
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card'; 
import { MatAutocompleteModule } from '@angular/material/autocomplete'; 

@Component({
  selector: 'app-update-product',
  imports: [CommonModule,ReactiveFormsModule,MatIconModule,MatButtonModule,MatAutocompleteModule,MatFormFieldModule,MatInputModule,MatSelectModule,MatIconModule,MatSnackBarModule,MatToolbarModule,MatCardModule],
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css'],
})
export class UpdateProductComponent implements OnInit {
  productForm: FormGroup;
  baseUrl = 'http://localhost:5000';
  productId!: string;
  categories = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen'];
  filteredCategories!: Observable<string[]>;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFileName: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      image: ['', Validators.pattern(/^(http(s?):\/\/).*/)],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.loadProduct();
    this.filteredCategories = this.productForm.get('category')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCategories(value))
    );
  }

  private _filterCategories(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.categories.filter(category => 
      category.toLowerCase().includes(filterValue));
  }

  addNewCategory() {
    const newCategory = this.productForm.get('category')?.value;
    if (newCategory && !this.categories.includes(newCategory)) {
      this.categories.unshift(newCategory);
      this.productForm.get('category')?.setValue(newCategory);
    }
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.productForm.patchValue({ image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  updateImagePreview() {
    const imageUrl = this.productForm.get('image')?.value;
    if (imageUrl) {
      this.imagePreview = imageUrl;
    }
  }

  loadProduct() {
    this.productService.getProductById(this.productId).subscribe(product => {
      this.productForm.patchValue(product);
      this.imagePreview = product.image ? this.baseUrl + product.image : 'assets/placeholder-image.jpg';
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.productService.updateProduct(this.productId, this.productForm.value)
        .subscribe({
          next: () => {
            this.snackBar.open('Product updated successfully!', 'Close', { duration: 3000 });
            this.router.navigate(['/products']);
          },
          error: () => {
            this.snackBar.open('Error updating product', 'Close', { duration: 3000 });
          }
        });
    }
  }

  onCancel() {
    this.router.navigate(['/products']);
  }
}