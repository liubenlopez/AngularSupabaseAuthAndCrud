import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment.development';
import { SpinnerService } from './spinner.service';
import { ToastService } from 'angular-toastify';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private supabaseCliente: SupabaseClient;

  constructor(
    private readonly spinnerService: SpinnerService,
    private _toastService: ToastService,
  ) {
    this.supabaseCliente = createClient(environment.supabase.url, environment.supabase.publicKey);
  }

  async getAllProducts() {
    this.spinnerService.show("Getting products ...");
    let { data: productos, error } = await this.supabaseCliente
      .from('productos')
      .select('*');
    if (error) {
      console.log(error);
      this._toastService.error('Connection error.');
    }
    this.spinnerService.hide();
    return productos;
  }

  async createProduct(nombre: string, precio: number, image: string, createBy: string) {
    this.spinnerService.show("Creating product ...");
    const { data, error } = await this.supabaseCliente
      .from('productos')
      .insert([
        { nombre: nombre, precio: precio, image: image, createBy: createBy },
      ])
      .select();
    if (error) {
      console.log(error);
      this._toastService.error('Connection error.');
    }
    this.spinnerService.hide();
    return data;
  }

  async updateProduct(nombre: string, precio: number, image: string, id: number, createBy: string) {
    this.spinnerService.show("Updating product ...");
    const { data, error } = await this.supabaseCliente
      .from('productos')
      .update({ nombre: nombre, precio: precio, image: image, createBy: createBy })
      .eq('id', id)
      .select();
    if (error) {
      console.log(error);
      this._toastService.error('Connection error.');
    }
    this.spinnerService.hide();
    return data;
  }

  async deleteProduct(product: any) {
    this.spinnerService.show("Deleting product ...");
    const { data, error } = await this.supabaseCliente
      .from('productos')
      .delete()
      .eq('id', product.id);
    await this.removeImageProduct(product.image);
    if (error) {
      console.log(error);
      this._toastService.error('Connection error.');
    }
    this.spinnerService.hide();
  }

  // Storage
  async uploadImageProduct(filePath: string, file: File) {
    const { data, error } = await this.supabaseCliente.storage.from('ProductImages').upload(filePath, file);
    if (error) {
      this._toastService.error('Upload error.');
    }
    return data;
  }

  async listImageProduct() {
    const { data, error } = await this.supabaseCliente.storage.from('ProductImages').list();
    if (error) {
      this._toastService.error('Upload error.');
    }
    return data;
  }

  async removeImageProduct(filename: string) {
    const { data, error } = await this.supabaseCliente.storage.from('ProductImages').remove([filename]);
    if (error) {
      this._toastService.error('Upload error.');
    }
    return data;
  }

}
