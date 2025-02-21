export interface Product {
    _id: string; 
    name: string; 
    description: string; 
    price: number; 
    category: string; 
    stock: number;
    image?: string; 
    createdAt?: Date; 
    updatedAt?: Date; 
  }  

  export class ProductUtils {
    static isOutOfStock(product: Product): boolean {
      return product.stock === 0;
    }
  
    static isLowStock(product: Product): boolean {
      return product.stock <= 10 && product.stock > 0;
    }
  
    static formatPrice(product: Product, currency: string = 'USD'): string {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
      }).format(product.price);
    }
  
    static getProductImage(product: Product): string {
      return product.image || 'assets/images/placeholder-image.jpg';
    }
  }