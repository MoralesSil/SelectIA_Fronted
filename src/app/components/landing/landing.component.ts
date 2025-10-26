import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common'; // Asegúrate de importar CommonModule

@Component({
  selector: 'app-landing',
  imports: [
    MatToolbarModule,
    MatIconModule,
    CommonModule 
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  menuAbierto = false;
  windowWidth: number;

  constructor() {
    this.windowWidth = this.getWindowWidth();
  }

  ngOnInit() {
    this.windowWidth = this.getWindowWidth();
  }

  getWindowWidth(): number {
    return typeof window !== 'undefined' ? window.innerWidth : 1024; // Valor predeterminado
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto; // Cambia el estado del menú al hacer clic
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.windowWidth = this.getWindowWidth();
    
    // Oculta el menú si el ancho de la ventana es mayor a 768px
    if (this.windowWidth > 768) {
      this.menuAbierto = false;
    }
  }

  isSmallScreen(): boolean {
    return this.windowWidth <= 768; // Retorna verdadero si la pantalla es pequeña
  }
}
