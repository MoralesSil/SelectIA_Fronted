import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioService } from '../../../services/usuario.service';
import { LoginService } from '../../../services/login.service';
import { Usuario } from '../../../models/usuario';
import { Storage, ref, uploadBytes, getDownloadURL} from '@angular/fire/storage';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PerfilPostulanteService } from '../../../services/perfil-postulante.service';
import { PerfilPostulante } from '../../../models/perfil-postulante';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RecomendacionService } from '../../../services/recomendacion.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-visualizar',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './visualizar.component.html',
  styleUrl: './visualizar.component.css'
})
export class VisualizarComponent implements OnInit {
  usuario: Usuario = new Usuario();
  imagenPreview: string | ArrayBuffer | null = null;
  perfilPostulante?: PerfilPostulante;
  mostrarPdf = false;
  cvSanitizadoUrl?: SafeResourceUrl;
  imagenFile: File | null = null;
  rol: string | null = null;


  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private usuarioService: UsuarioService,
    private loginService: LoginService,
     private perfilPostulanteService: PerfilPostulanteService,
    private router: Router,
    private recomendacionService: RecomendacionService,
    private sanitizer: DomSanitizer,
    private storage: Storage,
    private snackbar: MatSnackBar
    
  ) {}

  ngOnInit(): void {
  const username = this.loginService.showUsername();
  this.rol = this.loginService.showRole();
  if (username) {
    this.usuarioService.buscarPorUsername(username).subscribe({
      next: (usuario) => {
        this.usuario = usuario;

        // Siempre inicializa perfilPostulante por defecto
        this.perfilPostulante = {
          idPerfil: 0,
          usuario: this.usuario,
          cvUrl: '',
          textoExtraido: '',
          educacion: '',
          experiencia: '',
          habilidadesTecnicas: '',
          habilidadesBlandas: '',
          certificaciones: '',
          embeddingVector: '',
          setEmbEducacion: '',
          setEmbExperiencia: '',
          setEmbHabTec: '',
          setEmbHabBlandas: '',
          setcertificaciones: '',
        };

        // Intenta traer el perfil del backend
        if (usuario.idUsuario) {
          this.perfilPostulanteService.buscarPorUsuario(usuario.idUsuario).subscribe({
            next: (perfil) => {
              if (perfil) {
                this.perfilPostulante = perfil;
              }
            },
            error: (_) => {
            }
          });
        }
      },
      error: (err) => {
        console.error('Error al traer usuario por username', err);
      }
    });
  }
}

crearPerfilPostulante() {
  this.perfilPostulante = {
          idPerfil: 0,
          usuario: this.usuario,
          cvUrl: '',
          textoExtraido: '',
          educacion: '',
          experiencia: '',
          habilidadesTecnicas: '',
          habilidadesBlandas: '',
          certificaciones: '',
          embeddingVector: '',
          setEmbEducacion: '',
          setEmbExperiencia: '',
          setEmbHabTec: '',
          setEmbHabBlandas: '',
          setcertificaciones: '',
  };
}



abrirPdf(url: string) {
  fetch(url, { method: 'HEAD' })
    .then(res => {
      const contentType = res.headers.get('Content-Type');
      if (contentType && contentType.includes('pdf')) {
        this.cvSanitizadoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.mostrarPdf = true;
      } else {
        // Si no es PDF, lo abre en nueva pestaña
        window.open(url, '_blank');
      }
    })
    .catch(() => {
      // Si falla el fetch, igual lo abre en nueva pestaña
      window.open(url, '_blank');
    });
}


  
  
actualizarDatosPostulante() {
  const username = this.loginService.showUsername();
  if (!username) {
    this.snackbar.open('No se encontró el username', 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-error'],
    });
    return;
  }

  this.usuarioService.buscarPorUsername(username).subscribe({
    next: usuario => {
      if (!usuario || !usuario.idUsuario) {
        this.snackbar.open('No se encontró el usuario', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
        return;
      }

      // Actualiza siempre el usuario en el perfil local
      if (!this.perfilPostulante) return;
      this.perfilPostulante.usuario = usuario;

      // Primero buscar si existe perfilPostulante en el backend
      this.perfilPostulanteService.buscarPorUsuario(usuario.idUsuario).subscribe({
        next: perfil => {
          if (perfil && perfil.idPerfil) {
            // Si existe, actualizarlo
            console.log('[REQ crear/actualizar PerfilPostulante]', this.perfilPostulante);
            this.recomendacionService.actualizarCamposPerfilPostulante(this.perfilPostulante!).subscribe({
              next: () => {
                this.snackbar.open('¡Datos de postulación actualizados!', 'Cerrar', {
                  duration: 3000,
                  panelClass: ['snackbar-ok'],
                });
              },
              error: err => {
                this.snackbar.open('Error al actualizar los datos de postulación', 'Cerrar', {
                  duration: 3000,
                  panelClass: ['snackbar-error'],
                });
                console.error(err);
              }
            });
          } else {
            // Si no existe, crearlo
            this.recomendacionService.crearPerfilPostulante(this.perfilPostulante!).subscribe({
              next: () => {
                this.snackbar.open('¡Perfil creado exitosamente!', 'Cerrar', {
                  duration: 3000,
                  panelClass: ['snackbar-ok'],
                });
              },
              error: err => {
                this.snackbar.open('Error al crear el perfil', 'Cerrar', {
                  duration: 3000,
                  panelClass: ['snackbar-error'],
                });
                console.error(err);
              }
            });
          }
        },
        error: err => {
          // Si ocurre un error en la búsqueda, lo tomamos como que NO existe (puede ser 404)
          this.recomendacionService.crearPerfilPostulante(this.perfilPostulante!).subscribe({
            next: () => {
              this.snackbar.open('¡Perfil creado exitosamente!', 'Cerrar', {
                duration: 3000,
                panelClass: ['snackbar-ok'],
              });
            },
            error: err => {
              this.snackbar.open('Error al crear el perfil', 'Cerrar', {
                duration: 3000,
                panelClass: ['snackbar-error'],
              });
              console.error(err);
            }
          });
        }
      });
    },
    error: err => {
      this.snackbar.open('Error al obtener usuario', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-error'],
      });
      console.error(err);
    }
  });
}



  cerrarPdf() {
    this.mostrarPdf = false;
    this.cvSanitizadoUrl = undefined;
  }
  getNombreArchivo(url?: string): string {
  if (!url) return '';
  return url.split('/').pop() || url;
  }

    verCV(url?: string) {
      if (!url) return;
      window.open(url, '_blank'); // Abre el PDF en una nueva pestaña
    }


    
  subirImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    this.imagenFile = input.files[0];
    const archivo = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagenPreview = reader.result;
    };
    reader.readAsDataURL(archivo);
  }

  
  eliminarImagen(): void {
    this.usuario.imagenUrl = '';
    this.imagenPreview = null;
    // Si deseas notificar al backend, puedes agregar una llamada a usuarioService aquí
  }

  async guardarCambios(): Promise<void> {
  if (!this.usuario.idUsuario) {
    this.snackbar.open('No se pudo identificar al usuario', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-error'],
  });
    return;
  }
  console.log('Usuario que se enviará al backend:', this.usuario);
    if (this.imagenFile) {
    const username = this.loginService.showUsername();
    const imgRef = ref(this.storage, `imagenes/${username}`);

    try {
      await uploadBytes(imgRef, this.imagenFile);
      const url = await getDownloadURL(imgRef);
      this.usuario.imagenUrl = url;
    } catch (err) {
      this.snackbar.open('Error al subir imagen de perfil', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-error'],
      });
      console.error(err);
      return;
    }
  }

  this.usuarioService.actualizar(this.usuario.idUsuario, this.usuario).subscribe({
    next: () => {
      this.snackbar.open('¡Perfil creado actualizado!', 'Cerrar', {
                  duration: 3000,
                  panelClass: ['snackbar-ok'],
                });
                
    },
    error: (err) => {
      this.snackbar.open('Error al actualizar perfil', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-error'],
      });
      console.error(err);
    }
  });
}

subir(): void {
    this.router.navigate(['/perfil', 'Cargar']);
}

}
