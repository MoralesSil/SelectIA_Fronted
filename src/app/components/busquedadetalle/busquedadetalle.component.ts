import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap, map, forkJoin, of, throwError } from 'rxjs';

import { OfertaLaboralService } from '../../services/oferta-laboral.service';
import { PostulacionService } from '../../services/postulacion.service';
import { UsuarioService } from '../../services/usuario.service';
import { PerfilPostulanteService } from '../../services/perfil-postulante.service';
import { LoginService } from '../../services/login.service';

import { OfertaLaboral } from '../../models/oferta-laboral';
import { Postulacion } from '../../models/postulacion';

@Component({
  selector: 'app-busquedadetalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './busquedadetalle.component.html',
  styleUrl: './busquedadetalle.component.css'
})
export class BusquedadetalleComponent implements OnInit {

  oferta!: OfertaLaboral;               // oferta mostrada en pantalla
  descripcionFormateada = '';

  yaPostulado = false;

  constructor(
    private rutaActiva: ActivatedRoute,
    private ofertaService: OfertaLaboralService,
    private usuarioService:   UsuarioService,
    private perfilService:    PerfilPostulanteService,
    private postulacionService: PostulacionService,
    private loginService: LoginService,
    private snackbar: MatSnackBar
  ) {}

  /* --------- Carga de la oferta --------- */
  ngOnInit(): void {
  const idOferta = +this.rutaActiva.snapshot.params['id'];

  this.ofertaService.buscarPorId(idOferta).subscribe(oferta => {
    this.oferta = oferta;
    this.descripcionFormateada =
      oferta.puestoDeTrabajo?.descripcion?.replace(/\.\s+/g, '.\n') ?? '';

    // Verificar si el usuario ya postuló
    const username = this.loginService.showUsername();
    if (!username) return;

    this.usuarioService.buscarPorUsername(username).subscribe(usuario => {
      if (!usuario.idUsuario) return;

      this.postulacionService.existePostulacion(usuario.idUsuario, idOferta)
        .subscribe(existe => {
          this.yaPostulado = existe;
        });
    });
  });
}

  /* --------- Acción del botón “Aplicar” --------- */
aplicarPuesto(): void {
  console.log('[INICIO] aplicarPuesto()');

  const username = this.loginService.showUsername();
  if (!username) {
    this.snackbar.open('No se encontró el usuario', 'Cerrar', {
      duration: 3000,
      panelClass: ['snackbar-error'],
    });
    return;
  }

  this.usuarioService.buscarPorUsername(username).pipe(

    /* 1. Obtener perfil */
    switchMap(usuario => {
      if (!usuario.idUsuario) {
        return throwError(() => new Error('No se encontró el id del usuario'));
      }
      return this.perfilService.buscarPorUsuario(usuario.idUsuario).pipe(
        map(perfil => ({ usuario, perfil }))
      );
    }),

    /* 2. Construir e insertar la postulación */
    switchMap(({ perfil }) => {
      const postulacion: Postulacion = {
        idPostulacion: 0,
        fechaPostulacion: new Date(),
        perfilPostulante: { idperfil: perfil.idPerfil } as any,
        ofertaLaboral: { idoferta: this.oferta.idOferta } as any,
        estado: true
      };

      console.log('[POSTULACIÓN] Enviando postulación:', postulacion);
      return this.postulacionService.insertar(postulacion);
    })


  ).subscribe({

    /* Éxito */
    next: () => {
      this.snackbar.open('¡Has aplicado exitosamente al puesto!', 'Cerrar', {
        duration: 3000,
      });
    },

    /* Error */
    error: (err) => {
      console.error('[ERROR POSTULACIÓN]', err);
      const msg = 'Completa su perfil correctamente';
      this.snackbar.open(msg, 'Cerrar', {
        duration: 4000,
        panelClass: ['snackbar-error'],
      });
    }
  });
}
}
