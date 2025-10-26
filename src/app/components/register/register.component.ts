import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() solicitarInicio = new EventEmitter<void>();

  form: FormGroup = new FormGroup({});
  id: number = 0;
  isPasswordVisible = false;

  constructor(
    private uS: UsuarioService,
    private loginG: LoginService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
    });

     this.form = this.formBuilder.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contra: ['', [Validators.required, Validators.minLength(8)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      telefono: ['', [Validators.required, Validators.minLength(9)]]
    });
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  autoFillEmailDomain() {
    const emailControl = this.form.get('correo');
    if (emailControl && emailControl.value && !emailControl.value.includes('@')) {
      emailControl.setValue(emailControl.value + '@gmail.com');
    }
  }

  closeRegister() {
    this.close.emit();
  }

  registrar(): void {
  if (this.form.valid) {
    const correo = this.form.value.correo;
    const username = this.form.value.username;

    this.uS.buscarPorCorreo(correo).subscribe({
      next: (usuarioExistente) => {
        if (usuarioExistente) {
          this.form.controls['correo'].setErrors({ correoRepetido: true });
          this.snackbar.open('El correo ya está en uso', '', { duration: 3000 });
        }
      },
      error: () => {
        // Armar el objeto Usuario
        const nuevoUsuario: Usuario = {
          nombres: this.form.value.nombres,
          apellidos: this.form.value.apellidos,
          username: this.form.value.username,
          correo: this.form.value.correo,
          contraseña: this.form.value.contra,
          telefono: this.form.value.telefono,
          imagenUrl: '',
          estado: true,
          enabled: true,
          fechaRegistro: new Date(),
          tipodeDocuemnto: '',
          numeroDocumento: 0,
          distrito: '',
          departamento: '',
          pais: '',
          direccion: '',
          linkedin: '',
          redSocialPrincipal: ''
        };

        this.loginG.registrar(nuevoUsuario).subscribe({
            next: () => {
              this.snackbar.open('Usuario registrado exitosamente', '', { duration: 3000 });
              this.solicitarInicio.emit();
            },
            error: err => {
              console.error('Error al registrar:', err);
              this.snackbar.open('Error al registrar: ' + (err.error?.message || err.message), '', { duration: 3000 });
            }
        });

      }
    });
  } else {
    this.snackbar.open('Por favor completa todos los campos obligatorios', 'cerrar', {
      duration: 3000
    });
  }
}

}
