import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthSupabaseService } from 'src/app/services/auth-supabase.service';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  userEmail: string = "";
  products: any[] | null = [];
  productForm!: FormGroup;
  productSelected: any = null;
  nombreCloseBtn: boolean = false;
  precioCloseBtn: boolean = false;
  disableForm: boolean = false;
  upladingImage: boolean = false;
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private readonly productosService: ProductosService,
    private readonly authSupabaseService: AuthSupabaseService
  ) { }

  ngOnInit(): void {
    this.getAllProducts();
    this.resetFormGroup();
    this.authSupabaseService.authChanges((_, session) => {
      if (session?.user?.email)
        this.userEmail = session.user.email;
    });
  }

  resetFormGroup() {
    this.productForm = new FormGroup({
      'nombre': new FormControl('', [Validators.required]),
      'precio': new FormControl('', [Validators.required]),
      'image': new FormControl(''),
    });
    if (this.fileInput)
      this.fileInput.nativeElement.value = '';
  }

  async getAllProducts() {
    this.products = await this.productosService.getAllProducts();
    const listImageProduct = await this.productosService.listImageProduct();
    if (listImageProduct) {
      this.removeUnusedFiles(listImageProduct);
    }
  }

  selectProduct(product: any) {
    this.productSelected = product;
    this.productForm.setValue({
      nombre: product.nombre,
      precio: product.precio,
      image: product.image,
    });
  }

  cleanSelectedProduct() {
    this.resetFormGroup();
    this.productSelected = null;
  }

  async createProduct() {
    if (this.productForm.value.nombre && this.productForm.value.precio) {
      this.disableForm = true;
      const product = await this.productosService.createProduct(this.productForm.value.nombre, this.productForm.value.precio, this.productForm.value.image, this.userEmail);
      if (product && product.length > 0 && product[0]) {
        this.products?.push(product[0]);
        document.getElementById("closeModal")?.click();
      }
      this.disableForm = false;
    }
  }

  async updateProduct() {
    if (this.productForm.value.nombre && this.productForm.value.precio && this.productSelected.id) {
      this.disableForm = true;
      const product = await this.productosService.updateProduct(this.productForm.value.nombre, this.productForm.value.precio, this.productForm.value.image, this.productSelected.id, this.userEmail);
      if (product && product.length > 0 && product[0]) {
        if (this.products) {
          for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id == product[0].id) {
              this.products[i] = product[0];
            }
          }
        }
        document.getElementById("closeModal")?.click();
      }
      this.disableForm = false;
    }
  }

  deleteProduct(product: any) {
    if (confirm("Are you sure you want to remove this product?")) {
      this.productosService.deleteProduct(product);
      if (this.products) {
        this.products = this.products.filter(item => { return item.id != product.id });
      }
    }
  }

  async uploadImage(event: any) {
    try {
      this.upladingImage = true;
      if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0]
        const fileExt = file.name.split('.').pop()
        const filePath = `${Date.now()}.${fileExt}`
        const path = await this.productosService.uploadImageProduct(filePath, file);
        this.productForm.get('image')?.setValue(path?.path);
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.upladingImage = false;
    }
  }

  async removeImageProduct(filename: string) {
    try {
      await this.productosService.removeImageProduct(filename);
    } catch (error) {
      console.log(error);
    }
  }

  removeUnusedFiles(listImageProduct: any[]) {
    for (let image of listImageProduct) {
      if (image.name != ".emptyFolderPlaceholder") {
        let deleteImage = true;
        if (this.products) {
          for (let product of this.products) {
            if (product.image == image.name) {
              deleteImage = false;
              break;
            }
          }
        }
        if (deleteImage)
          this.removeImageProduct(image.name);
      }
    }
  }

  onSubmit() {
    if (this.productSelected) {
      this.updateProduct();
    } else {
      this.createProduct();
    }
  }

  nombreCloseBtnClick(): void {
    this.nombreCloseBtn = true;
  }

  precioCloseBtnClick(): void {
    this.precioCloseBtn = true;
  }

}
