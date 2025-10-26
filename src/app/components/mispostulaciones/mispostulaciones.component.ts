import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { UsuarioService } from '../../services/usuario.service';
import { PerfilPostulanteService } from '../../services/perfil-postulante.service';
import { PostulacionService } from '../../services/postulacion.service';
import { switchMap } from 'rxjs/operators';
import { VerPostulacion } from '../../models/VerPostulacion';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-mispostulaciones',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './mispostulaciones.component.html',
  styleUrl: './mispostulaciones.component.css'
})
export class MispostulacionesComponent implements OnInit {
  postulaciones: VerPostulacion[] = [];

  // Paginación
  paginaActual = 1;
  itemsPorPagina = 6;
  totalPaginas = 0;
  paginas: number[] = [];
  paginatedPostulaciones: VerPostulacion[] = [];

  constructor(
    private loginService: LoginService,
    private usuarioService: UsuarioService,
    private perfilPostulanteService: PerfilPostulanteService,
    private postulacionService: PostulacionService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const username = this.loginService.showUsername();
    if (!username) return;

    this.usuarioService.buscarPorUsername(username).pipe(
      switchMap(usuario => {
        const usuarioId = usuario.idUsuario ?? 0;
        return this.perfilPostulanteService.buscarPorUsuario(usuarioId);
      }),
      switchMap(perfil => this.postulacionService.buscarPorPerfilPostulante(perfil.idPerfil))
    ).subscribe(postulaciones => {
      this.postulaciones = postulaciones;
      this.configurarPaginacion();
    });
  }

  // Redirige al detalle
  verInformacion(idPuesto: number): void {
    this.router.navigate(['/busquedadetalle', idPuesto]);
  }

  // Calcula páginas y genera contenido paginado
  configurarPaginacion(): void {
    this.totalPaginas = Math.ceil(this.postulaciones.length / this.itemsPorPagina);
    this.paginas = Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
    this.cambiarPagina(1); // Mostrar primera página
  }

  // Cambia de página
  cambiarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;

    this.paginaActual = pagina;
    const inicio = (pagina - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.paginatedPostulaciones = this.postulaciones.slice(inicio, fin);
  }

  getColumnPlaceholders(): any[] {
    const visibles = this.paginatedPostulaciones.length;
    const totalColumnas = 3;
    const faltantes = totalColumnas - visibles;
    return Array(faltantes > 0 ? faltantes : 0).fill(null);
  }
}