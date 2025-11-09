import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { JwtRequest } from '../../models/jwtRequest';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, AfterViewInit {
  @Output() close = new EventEmitter<void>();
  @Output() loginExitoso = new EventEmitter<void>();
  @Output() solicitarRegistro = new EventEmitter<void>();

  username: string = '';
  password: string = '';
  mensaje: string = '';
  isPasswordVisible = false;
  showLoginModal = true;

  // 🔁 modo del switch: false = Postulante, true = Reclutador
  isReclutadorMode = false;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // reCAPTCHA desactivado
  }

  get modoSeleccionado(): 'Postulante' | 'Reclutador' {
    return this.isReclutadorMode ? 'Reclutador' : 'Postulante';
  }

  closeLogin() {
    this.close.emit();
  }

  private logout() {
    sessionStorage.removeItem('token');
    sessionStorage.clear();
  }

  login() {
    const request = new JwtRequest();
    request.username = this.username;
    request.password = this.password;

    this.loginService.login(request).subscribe(
      (data: any) => {
        // Guardamos token inicialmente
        sessionStorage.setItem('token', data.jwttoken);

        const rol = this.loginService.showRole(); // Rol real del usuario (JWT)
        const modo = this.modoSeleccionado;       // Modo elegido en el switch

        // Validar que el rol coincida con el modo
        const coincide =
          (rol === 'Reclutador' && modo === 'Reclutador') ||
          (rol === 'Postulante' && modo === 'Postulante');

        if (!coincide) {
          // Limpiamos sesión y mostramos mensaje formal
          this.logout();
          this.snackBar.open(
            `No puede iniciar sesión en el modo seleccionado (${modo}). Su perfil registrado es: ${rol}.`,
            'Cerrar',
            { duration: 4000 }
          );
          return;
        }

        // Si coincide, procedemos normalmente
        this.loginExitoso.emit();
        this.close.emit();

        if (rol === 'Reclutador') {
          this.router.navigate(['/home']);
        } else if (rol === 'Postulante') {
          this.router.navigate(['/busqueda']);
        } else {
          this.router.navigate(['/landing']);
        }
      },
      (error) => {
        this.mensaje = 'Credenciales incorrectas.';
        this.snackBar.open(this.mensaje, 'Cerrar', { duration: 2000 });
      }
    );
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
