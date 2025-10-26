import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { JwtRequest } from '../../models/jwtRequest';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

//declare var grecaptcha: any;

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
export class LoginComponent implements OnInit, AfterViewInit{
  @Output() close = new EventEmitter<void>();
  @Output() loginExitoso = new EventEmitter<void>();
  @Output() solicitarRegistro = new EventEmitter<void>();

  username: string = '';
  password: string = '';
  mensaje: string = '';
  isPasswordVisible = false;
  showLoginModal = true;
  //recaptchaWidgetId: number | null = null;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

   ngAfterViewInit(): void {
    // Espera a que grecaptcha esté disponible y renderiza el widget manualmente
    /*if (typeof grecaptcha !== 'undefined') {
      this.recaptchaWidgetId = grecaptcha.render('recaptcha-container', {
        sitekey: '6LdkcVcrAAAAAJw_du9WrsffXnARSYiBiGslv_dD'  // Reemplaza con tu clave pública
      });
    } else {
      console.error('reCAPTCHA no está disponible. Verifica que el script fue cargado.');
    }*/
  }
  
  closeLogin() {
    this.close.emit();
  }

  login() {
    /*if (typeof grecaptcha === 'undefined' || this.recaptchaWidgetId === null) {
      alert('reCAPTCHA no está disponible.');
      return;
    }

    const captchaResponse = grecaptcha.getResponse(this.recaptchaWidgetId);
    if (!captchaResponse) {
      alert('Por favor verifica que no eres un robot.');
      return;
    }*/

    const request = new JwtRequest();
    request.username = this.username;
    request.password = this.password;

    this.loginService.login(request).subscribe(
      (data: any) => {
        sessionStorage.setItem('token', data.jwttoken);
        this.loginExitoso.emit();
        this.close.emit();
        
        const rol = this.loginService.showRole();

          if (rol === 'Reclutador') {
            this.router.navigate(['/home']);
          } else if (rol === 'Postulante') {
            this.router.navigate(['/busqueda']);
          } else {
            this.router.navigate(['/landing']); // o '/admin', si tienes una ruta especial
          }
      },
      (error) => {
        this.mensaje = 'Credenciales incorrectas!!!';
        this.snackBar.open(this.mensaje, 'Cerrar', { duration: 2000 });
        // Opcional: resetear el CAPTCHA
        //grecaptcha.reset(this.recaptchaWidgetId!);
      }
    );
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
