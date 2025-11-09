import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OfertaLaboral } from '../../models/oferta-laboral';
import { OfertaLaboralService } from '../../services/oferta-laboral.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PostulacionService } from '../../services/postulacion.service';
import { UsuarioService } from '../../services/usuario.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-busqueda',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './busqueda.component.html',
  styleUrl: './busqueda.component.css'
})
export class BusquedaComponent implements OnInit {

  modalidades = ['Presencial', 'Híbrido', 'Remoto'];
  experienciaLista: string[] = [];
  modalidadSeleccionada = [false, false, false];
  experienciaSeleccionada: boolean[] = [];
  estadoPostulacion: { [key: number]: boolean } = {};
  usuarioid?: number = 0;
  isLoggedIn: boolean = false;

  cantidadesModalidad = [0, 0, 0];
  cantidadesExperiencia: number[] = [];

  filtrosAbiertos: { [key: string]: boolean } = {
    modalidad: true,
    experiencia: true
  };

  ofertas: OfertaLaboral[] = [];
  ofertasFiltradas: OfertaLaboral[] = [];

  puestoParam: string = '';
  lugarParam: string = '';

  constructor(
    private ofertaService: OfertaLaboralService,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private loginService: LoginService,
    private postulacionService: PostulacionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.loginService.verificar();
    this.route.queryParams.subscribe(params => {
      this.puestoParam = params['puesto']?.toLowerCase() || '';
      this.lugarParam = params['lugar']?.toLowerCase() || '';

      const username = this.loginService.showUsername();
      if (username) {
        this.usuarioService.buscarPorUsername(username).subscribe({
          next: usuario => {
            this.usuarioid = usuario.idUsuario;
            this.cargarOfertasYEstados(true);
          },
          error: () => this.cargarOfertasYEstados(false)
        });
      } else {
        this.cargarOfertasYEstados(false);
      }
    });
  }

  cargarOfertasYEstados(conUsuario: boolean) {
    this.ofertaService.listar().subscribe(ofertas => {
      this.ofertas = ofertas;
      this.cargarExperienciaDesdeRequisitos();
      this.ofertasFiltradas = [...this.ofertas];
      this.actualizarConteos();
      this.filtrarConParametros();

      this.ofertas.forEach(oferta => {
        const id = oferta.idOferta;
        this.estadoPostulacion[id] = false;

        if (conUsuario && this.usuarioid) {
          this.postulacionService.existePostulacion(this.usuarioid, id).subscribe(res => {
            this.estadoPostulacion[id] = res;
          });
        }
      });
    });
  }

  cargarExperienciaDesdeRequisitos() {
    const experienciasExtraidas: string[] = [];

    this.ofertas.forEach(oferta => {
      const experiencia = this.extraerExperiencia(oferta.puestoDeTrabajo.requisitos || '');
      if (experiencia) experienciasExtraidas.push(experiencia);
    });

    const base = ['Prácticas', 'Ejecutivo', 'Director'];
    this.experienciaLista = Array.from(new Set([...base, ...experienciasExtraidas]));
    this.experienciaSeleccionada = new Array(this.experienciaLista.length).fill(false);
  }

  extraerExperiencia(requisitos: string): string {
    const match = requisitos.match(/Experiencia:\s*([^\n\r]+)/i);
    return match?.[1]?.trim() || 'Sin experiencia';
  }

  aplicarFiltros() {
    const modalidadesActivas = this.modalidades.filter((_, i) => this.modalidadSeleccionada[i]);
    const experienciaActiva = this.experienciaLista.filter((_, i) => this.experienciaSeleccionada[i]);

    this.ofertasFiltradas = this.ofertas.filter(o => {
      const modalidad = o.puestoDeTrabajo.modalidad || '';
      const experiencia = this.extraerExperiencia(o.puestoDeTrabajo.requisitos || '');

      const coincideModalidad = modalidadesActivas.length === 0 || modalidadesActivas.includes(modalidad);
      const coincideExperiencia = experienciaActiva.length === 0 || experienciaActiva.includes(experiencia);

      return coincideModalidad && coincideExperiencia;
    });
  }

  limpiarFiltros() {
    this.modalidadSeleccionada = this.modalidadSeleccionada.map(() => false);
    this.experienciaSeleccionada = this.experienciaSeleccionada.map(() => false);
    this.ofertasFiltradas = [...this.ofertas];
  }

  actualizarConteos() {
    this.cantidadesModalidad = this.modalidades.map(m =>
      this.ofertas.filter(o => o.puestoDeTrabajo.modalidad?.includes(m)).length
    );

    this.cantidadesExperiencia = this.experienciaLista.map(e =>
      this.ofertas.filter(o =>
        this.extraerExperiencia(o.puestoDeTrabajo.requisitos || '') === e
      ).length
    );
  }

  filtrarConParametros() {
    this.ofertasFiltradas = this.ofertas.filter(o => {
      const puesto = o.puestoDeTrabajo.descripcion?.toLowerCase() || '';
      const lugar = o.puestoDeTrabajo.distrito?.toLowerCase() || '';

      return (!this.puestoParam || puesto.includes(this.puestoParam)) &&
             (!this.lugarParam || lugar.includes(this.lugarParam));
    });
  }

  toggleFiltro(nombre: string) {
    this.filtrosAbiertos[nombre] = !this.filtrosAbiertos[nombre];
  }

  postular(oferta: OfertaLaboral) {
  if (!this.isLoggedIn) {
    // Si no está logeado, lo manda al login
    this.router.navigate(['/login']);
    return;
  }

  // Si está logeado, continúa con el flujo normal
  this.estadoPostulacion[oferta.idOferta] = true;
  this.router.navigate(['/busquedadetalle', oferta.idOferta]);
}


  //limite de palabras titulo
  truncateWords(texto: string, limite: number = 10): string {
    if (!texto) return '';
    const palabras = texto.trim().split(/\s+/);
    return palabras.length > limite
      ? palabras.slice(0, limite).join(' ') + '...'
      : texto;
  }
}
