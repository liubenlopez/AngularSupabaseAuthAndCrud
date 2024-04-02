import { Component } from '@angular/core';
import { AuthSession, SupabaseClient, createClient } from '@supabase/supabase-js';
import { AuthSupabaseService } from 'src/app/services/auth-supabase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private readonly authSupabaseService: AuthSupabaseService) { }

  ngOnInit(): void {
  }

  getProductos() {

  }

}
