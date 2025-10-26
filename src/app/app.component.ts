import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginService } from './services/login.service';
import { UsuarioService } from './services/usuario.service';
import { TemplateRef } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    LoginComponent,
    RegisterComponent,
    MatSnackBarModule,
    RouterLink,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit{
  title = 'selectia';

  role: string = '';
  username: string = '';
  imagenPerfil: string = 'assets/img/default-profile.png';


  jobInputValue: string = '';
  placeInputValue: string = '';
  showDropdown = false;

  mostrarLogin = false;
  mostrarRegister = false;

  userMenuOpen = false;
  mobileMenuOpen = false;

  mostrarConfirmacion = false;

  allPlaces = [
    'Ancón','Ate','Barranco','Breña','Carabayllo','Cercado de Lima','Chaclacayo','Chorrillos',
    'Cieneguilla','Comas','El agustino','Independencia','Jesús maría','La molina','La victoria',
    'Lince','Los olivos','Lurigancho','Lurín','Magdalena del mar','Miraflores','Pachacámac','Pucusana',
    'Pueblo libre','Puente piedra','Punta hermosa','Punta negra','Rímac','San bartolo','San borja',
    'San isidro','San Juan de Lurigancho','San Juan de Miraflores','San Luis','San Martin de Porres',
    'San Miguel','Santa Anita','Santa María del Mar','Santa Rosa','Santiago de Surco','Surquillo',
    'Villa el Salvador','Villa Maria del Triunfo'
  ];
  filteredPlaces = [...this.allPlaces];

  constructor(
    private loginService: LoginService,
    private uS: UsuarioService,
    private router: Router,
    private snackBar: MatSnackBar) { }
  
  ngOnInit(): void {
    if (this.verificar()) {
      this.username = this.loginService.showUsername() ?? '';
      this.role = this.loginService.showRole() ?? '';

      this.cargarImagenPerfil();
    }
  }
  
  cargarImagenPerfil() {
  const username = this.loginService.showUsername();
  if (username) {
    this.uS.buscarPorUsername(username).subscribe({
      next: (usuario) => {
        this.imagenPerfil = usuario.imagenUrl || 'assets/img/default-profile.png';
      },
      error: (err) => {
        // Si falla, usa la imagen por defecto
        this.imagenPerfil = 'assets/img/default-profile.png';
      }
    });
  }
}

  onCustomInputChange() {
    const value = this.placeInputValue.toLowerCase();
    this.filteredPlaces = this.allPlaces.filter(p => p.toLowerCase().includes(value));
    this.showDropdown = true;
  }

  selectPlace(place: string) {
    this.placeInputValue = place;
    this.showDropdown = false;
  }

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  buscar() {
  const puesto = this.jobInputValue.trim();
  const lugar = this.placeInputValue.trim();

  // Redirigir incluso si uno de los campos está vacío
  this.router.navigate(['/busqueda'], {
    queryParams: {
      ...(puesto && { puesto }),
      ...(lugar && { lugar })
    }
  });
 }


  // Bonus: cerrar cuando haces click fuera
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    this.showDropdown = false;

    const target = event.target as HTMLElement;
    const clickedInsideUserMenu = target.closest('.user-info') || target.closest('.user-dropdown');

    if (!clickedInsideUserMenu) {
      this.userMenuOpen = false;
    }
  }

  verificar() {
    return this.loginService.verificar();
  }

  isPostulante() {
    return this.role === 'Postulante';
  }

  isAdministrador() {
    return this.role === 'Administrador';
  }

  isReclutador() {
    return this.role === 'Reclutador';
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  cerrarLogin() {
    this.mostrarLogin = false;
  }

  cerrarRegister() {
    this.mostrarRegister = false;
  }

  abrirLogin() {
    this.mostrarLogin = true;
    this.mostrarRegister = false;
    this.mobileMenuOpen = false;
  }

  abrirRegister() {
    this.mostrarRegister = true;
    this.mostrarLogin = false;
    this.mobileMenuOpen = false;
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  cerrarSesion(): void {
    this.mostrarConfirmacion = true;
  }

  cancelarCerrarSesion(): void {
    this.mostrarConfirmacion = false;
  }

  confirmarCerrarSesion(): void {
    sessionStorage.clear();
    this.role = '';
    this.username = '';
    this.mostrarConfirmacion = false;

    this.snackBar.open('¡Saliste de cuenta con éxito! Regresa pronto', 'Cerrar', {
      duration: 4000, // milisegundos
      panelClass: ['custom-snackbar']
    });
    this.router.navigate(['/landing']);
  }

  onLoginExitoso() {
    this.username = this.loginService.showUsername() ?? '';
    this.role = this.loginService.showRole() ?? '';
    this.cargarImagenPerfil();
  }

  verPerfil() {
    this.userMenuOpen = false;
    this.router.navigate(['/perfil']); // cambia la ruta si tu perfil tiene otra
  }

  irAMisPostulaciones() {
    this.userMenuOpen = false;
    this.router.navigate(['/mispostulaciones']);
  }

  abrirRegisterDesdeLogin() {
    this.mostrarLogin = false;
    this.mostrarRegister = true;
  } 

  abrirIniciorDesdeRegister() {
    this.mostrarLogin = true;
    this.mostrarRegister = false;
  }

}
