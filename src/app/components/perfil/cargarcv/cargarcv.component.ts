import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { LoginService } from '../../../services/login.service';
import { UsuarioService } from '../../../services/usuario.service';
import { PerfilPostulanteService } from '../../../services/perfil-postulante.service';
import { RecomendacionService } from '../../../services/recomendacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cargarcv',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cargarcv.component.html',
  styleUrl: './cargarcv.component.css'
})
export class CargarcvComponent {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  mensaje: string | null = null;
  mensajeTipo: 'ok' | 'error' | null = null;
  uploading = false;
  uploadFinished = false;
  procesoTerminado = false; // 👈 nueva bandera para mostrar el botón "Retroceder"
  progress = 0;
  uploadedFiles: File[] = [];
  downloadUrl: string = '';
  private readonly MAX_SIZE = 5 * 1024 * 1024; // 5MB

  constructor(
    private storage: Storage,
    private usuarioService: UsuarioService,
    private loginService: LoginService,
    private perfilPostulanteService: PerfilPostulanteService,
    private recomendacionService: RecomendacionService,
    private router: Router
  ) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.validarYProcesarArchivo(input.files[0]);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (!event.dataTransfer?.files.length) return;
    this.validarYProcesarArchivo(event.dataTransfer.files[0]);
  }

  validarYProcesarArchivo(file: File) {
    if (file.type !== 'application/pdf') {
      this.mostrarMensaje('Solo se permiten archivos en formato PDF.', 'error');
      return;
    }
    if (file.size > this.MAX_SIZE) {
      this.mostrarMensaje('El archivo excede el tamaño máximo de 5MB.', 'error');
      return;
    }
    this.uploadedFiles = [file];
    this.uploadFinished = true;
    this.mostrarMensaje('Archivo listo para subir.', 'ok');
  }

  subirCV() {
    if (!this.uploadFinished || this.uploadedFiles.length === 0) return;
    this.uploading = true;
    this.progress = 0;

    const file = this.uploadedFiles[0];
    const username = this.loginService.showUsername();
    const cvref = ref(this.storage, `cv/${username}`);

    uploadBytes(cvref, file)
      .then(() => getDownloadURL(cvref))
      .then((url) => {
        this.downloadUrl = url;
        this.usuarioService.buscarPorUsername(username).subscribe({
          next: (usuario) => {
            const usuarioid = usuario.idUsuario;
            if (usuarioid === undefined || usuarioid === null) {
              this.mostrarMensaje('Error: idUsuario no encontrado.', 'error');
              this.uploading = false;
              return;
            }

            // Si ya tiene perfil -> actualizar
            this.perfilPostulanteService.buscarPorUsuario(usuarioid).subscribe({
              next: (perfil) => {
                this.recomendacionService.actualizarPerfilPostulantePorUsuario(usuarioid, url).subscribe({
                  next: (res) => {
                    const msg = typeof res === 'string' ? res : res?.mensaje || 'Operación exitosa';
                    this.mostrarMensaje(msg, 'ok');
                    this.uploading = false;
                    this.procesoTerminado = true; // 👈 habilita el botón "Retroceder"
                  },
                  error: (err) => {
                    this.mostrarMensaje('Error al actualizar el CV', 'error');
                    this.uploading = false;
                  }
                });
              },
              // Si no tiene perfil -> crear
              error: (err) => {
                this.recomendacionService.registerPerfilPostulante(usuarioid, url).subscribe({
                  next: (res) => {
                    const msg = typeof res === 'string' ? res : res?.mensaje || 'Operación exitosa';
                    this.mostrarMensaje(msg, 'ok');
                    this.uploading = false;
                    this.procesoTerminado = true; // 👈 habilita el botón "Retroceder"
                  },
                  error: (err) => {
                    this.mostrarMensaje('Error al crear el CV', 'error');
                    this.uploading = false;
                  }
                });
              }
            });
          },
          error: (err) => {
            this.mostrarMensaje('Usuario no encontrado', 'error');
            this.uploading = false;
          }
        });
      })
      .catch((error) => {
        this.mostrarMensaje('Error al subir el CV', 'error');
        this.uploading = false;
      });
  }

  retroceder() {
    this.router.navigate(['/perfil']); // 👈 redirige a /perfil
  }

  removeFile() {
    this.uploadedFiles = [];
    this.uploadFinished = false;
    this.progress = 0;
    this.mostrarMensaje('Archivo eliminado.', 'error');
  }

  mostrarMensaje(msg: string, tipo: 'ok' | 'error' | null) {
    this.mensaje = msg;
    this.mensajeTipo = tipo;
  }
}
