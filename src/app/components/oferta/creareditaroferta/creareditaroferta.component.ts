import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { switchMap, throwError } from 'rxjs';

import { PuestoDeTrabajo } from '../../../models/puesto-de-trabajo';
import { OfertaLaboralService } from '../../../services/oferta-laboral.service';
import { PuestoDeTrabajoService } from '../../../services/puesto-de-trabajo.service';
import { RecomendacionService } from '../../../services/recomendacion.service';

@Component({
  selector: 'app-creareditaroferta',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIcon, FormsModule, RouterModule],
  templateUrl: './creareditaroferta.component.html',
  styleUrl: './creareditaroferta.component.css'
})
export class CreareditarofertaComponent implements OnInit {

  formularioPuesto: FormGroup;

  // Ruta/Modo
  modoEdicion = false;          // true: /crearoferta/Ediciones/:id   |  false: /crearoferta
  idOfertaRuta!: number | null; // id de oferta tomado de la ruta (si existe)
  idPuesto!: number;            // id real del puesto (derivado de la oferta)

  // Badges: estado seleccionado y listas auxiliares
  requisitosData = {
    competencias: [] as string[],
    habilidades:  [] as string[],
    certificaciones: [] as string[]
  };
  listaCompetencias: string[] = [];
  listaHabilidades: string[] = [];
  listaCertificaciones: string[] = [];

  // Flags para inputs de agregar badge
  agregandoCompetencia = false;
  agregandoHabilidad  = false;
  agregandoCert       = false;

  // Sugerencias (no son estado real; se filtran contra seleccionados)
  sugerenciasCompetencias: string[] = ['Excel - Avanzado', 'SQL', 'Python', 'Power BI'];
  sugerenciasHabilidades:  string[] = ['Trabajo en equipo', 'Comunicación', 'Liderazgo', 'Organización'];
  sugerenciasCerts:        string[] = ['Google Data Analytics', 'Inglés B2', 'Scrum Master'];

  // Getters para sugerir solo lo NO seleccionado (evita duplicados visuales)
  get tecnicasSugeribles(): string[] {
    return this.sugerenciasCompetencias.filter(s => !this.requisitosData.competencias.includes(s));
  }
  get blandasSugeribles(): string[] {
    return this.sugerenciasHabilidades.filter(s => !this.requisitosData.habilidades.includes(s));
  }
  get certsSugeribles(): string[] {
    return this.sugerenciasCerts.filter(s => !this.requisitosData.certificaciones.includes(s));
  }

  allPlaces: string[] = [
    'Ancón','Ate','Barranco','Breña','Carabayllo','Cercado de Lima','Chaclacayo','Chorrillos',
    'Cieneguilla','Comas','El agustino','Independencia','Jesús maría','La molina','La victoria',
    'Lince','Los olivos','Lurigancho','Lurín','Magdalena del mar','Miraflores','Pachacámac','Pucusana',
    'Pueblo libre','Puente piedra','Punta hermosa','Punta negra','Rímac','San bartolo','San borja',
    'San isidro','San Juan de Lurigancho','San Juan de Miraflores','San Luis','San Martin de Porres',
    'San Miguel','Santa Anita','Santa María del Mar','Santa Rosa','Santiago de Surco','Surquillo',
    'Villa el Salvador','Villa Maria del Triunfo'
  ];

  constructor(
    private fb: FormBuilder,
    private rutaActiva: ActivatedRoute,
    private ofertaService: OfertaLaboralService,
    private puestoService: PuestoDeTrabajoService,
    private recomendacion: RecomendacionService,
    private snackbar: MatSnackBar
  ) {
    this.formularioPuesto = this.fb.group({
      // básicos
      titulo: ['', Validators.required],
      pais: [{ value: 'Perú', disabled: true }],
      departamento: [{ value: 'Lima', disabled: true }],
      distrito: ['', Validators.required],
      categoria: ['', Validators.required],
      descripcion: ['', Validators.required],
      jornada: ['', Validators.required],
      modalidad: ['', Validators.required],
      salario: ['', [Validators.required, Validators.min(0)]],
      // comparables por SBERT
      experiencia: ['', Validators.required], // texto libre
      educacion: ['']                         // texto libre (opcional)
    });
  }

  ngOnInit(): void {
    const idOferta = this.getIdOfertaFromRoute();
    console.log('%c[INIT]', 'color:#4CAF50;font-weight:bold', 'Componente iniciado.');
    console.log('🟢 ID de oferta en ruta:', idOferta);

    if (idOferta) {
      this.modoEdicion = true;
      this.idOfertaRuta = idOferta;

      console.log('📡 Buscando oferta laboral con ID:', idOferta);
      this.ofertaService.buscarPorId(idOferta).pipe(
        switchMap(oferta => {
          console.log('✅ Oferta encontrada:', oferta);

          const idPuesto = oferta?.puestoDeTrabajo?.idPuesto ?? oferta?.puestoDeTrabajo?.idPuesto;
          if (!idPuesto) return throwError(() => new Error('❌ La oferta no contiene id de puesto.'));
          this.idPuesto = Number(idPuesto);

          console.log('📍 ID del puesto obtenido de la oferta:', this.idPuesto);
          console.log('📡 Buscando puesto de trabajo con ID:', this.idPuesto);

          return this.puestoService.buscarPorId(this.idPuesto);
        })
      ).subscribe({
        next: (puesto) => {
          console.log('✅ Puesto recibido del backend:', puesto);
          this.patchFormularioDesdePuesto(puesto);
          this.patchBadgesDesdePuesto(puesto);
        },
        error: (e) => {
          console.error('🚨 Error cargando oferta/puesto:', e);
          this.snackbar.open('No se pudo cargar la información del puesto', 'Cerrar', {
            duration: 3000, panelClass: ['snackbar-error']
          });
        }
      });

    } else {
      // Modo creación
      this.modoEdicion = false;
      this.idOfertaRuta = null;
      console.log('📄 Modo creación de oferta (sin ID en ruta)');
    }
  }

  /** Lee :id desde la ruta actual o desde el primer hijo (cuando usas children) */
  private getIdOfertaFromRoute(): number | null {
    const fromSelf = this.rutaActiva.snapshot.paramMap.get('id');
    if (fromSelf) return Number(fromSelf);

    const child = this.rutaActiva.firstChild?.snapshot.paramMap.get('id');
    if (child) return Number(child);

    return null;
  }

  /* ---------------- Patches de UI ---------------- */

  private patchFormularioDesdePuesto(p: PuestoDeTrabajo) {
    console.log('🧩 Rellenando formulario con los datos del puesto...');
    this.formularioPuesto.patchValue({
      titulo: p.titulo ?? '',
      pais: 'Perú',
      departamento: 'Lima',
      distrito: p.distrito ?? '',
      categoria: p.categoria ?? '',
      descripcion: p.descripcion ?? '',
      jornada: p.jornada ?? '',
      modalidad: p.modalidad ?? '',
      salario: p.salario ?? 0,
      experiencia: p.experiencia ?? '',
      educacion: p.educacion ?? ''
    }, { emitEvent: false });
  }

  private uniq(arr: string[]): string[] {
    return Array.from(new Set(arr.map(s => s.trim()))).filter(Boolean);
  }

  private patchBadgesDesdePuesto(p: PuestoDeTrabajo) {
    const toArr = (s?: string) => (s ?? '').split(',').map(x => x.trim()).filter(Boolean);

    const comp = this.uniq(toArr(p.habilidadesTecnicas));
    const habs = this.uniq(toArr(p.habilidadesBlandas));
    const cert = this.uniq(toArr(p.certificaciones));

    // listas auxiliares (para autocompletar/mostrar)
    this.listaCompetencias = [...comp];
    this.listaHabilidades  = [...habs];
    this.listaCertificaciones = [...cert];

    // estado seleccionado (real)
    this.requisitosData.competencias = [...comp];
    this.requisitosData.habilidades  = [...habs];
    this.requisitosData.certificaciones = [...cert];

    console.log('🎯 Badges cargados (deduplicados):', this.requisitosData);
  }

  /* ---------------- Validaciones ---------------- */

  isInvalid(controlName: string): boolean {
    const c = this.formularioPuesto.get(controlName);
    return c ? c.invalid && c.touched : false;
  }
  get competenciasInvalidas(): boolean { return this.requisitosData.competencias.length === 0; }
  get habilidadesInvalidas(): boolean  { return this.requisitosData.habilidades.length  === 0; }

  /* ---------------- Badges: técnicas ---------------- */

  toggleCompetencia(c: string) {
    const i = this.requisitosData.competencias.indexOf(c);
    i > -1 ? this.requisitosData.competencias.splice(i, 1) : this.requisitosData.competencias.push(c);
    if (!this.listaCompetencias.includes(c)) this.listaCompetencias.push(c);
    this.requisitosData.competencias = this.uniq(this.requisitosData.competencias);
    this.listaCompetencias = this.uniq(this.listaCompetencias);
  }
  mostrarInputCompetencia() { this.agregandoCompetencia = true; }
  cancelarAgregarCompetencia() { this.agregandoCompetencia = false; }
  agregarCompetencia(valor: string) {
    const t = valor.trim();
    if (t) {
      this.listaCompetencias.push(t);
      this.requisitosData.competencias.push(t);
      this.listaCompetencias = this.uniq(this.listaCompetencias);
      this.requisitosData.competencias = this.uniq(this.requisitosData.competencias);
    }
    this.agregandoCompetencia = false;
  }
  eliminarCompetencia(comp: string) {
    this.listaCompetencias = this.listaCompetencias.filter(c => c !== comp);
    this.requisitosData.competencias = this.requisitosData.competencias.filter(c => c !== comp);
  }

  /* ---------------- Badges: blandas ---------------- */

  toggleHabilidad(h: string) {
    const i = this.requisitosData.habilidades.indexOf(h);
    i > -1 ? this.requisitosData.habilidades.splice(i, 1) : this.requisitosData.habilidades.push(h);
    if (!this.listaHabilidades.includes(h)) this.listaHabilidades.push(h);
    this.requisitosData.habilidades = this.uniq(this.requisitosData.habilidades);
    this.listaHabilidades = this.uniq(this.listaHabilidades);
  }
  mostrarInputHabilidad() { this.agregandoHabilidad = true; }
  cancelarAgregarHabilidad() { this.agregandoHabilidad = false; }
  agregarHabilidad(valor: string) {
    const t = valor.trim();
    if (t) {
      this.listaHabilidades.push(t);
      this.requisitosData.habilidades.push(t);
      this.listaHabilidades = this.uniq(this.listaHabilidades);
      this.requisitosData.habilidades = this.uniq(this.requisitosData.habilidades);
    }
    this.agregandoHabilidad = false;
  }
  eliminarHabilidad(h: string) {
    this.listaHabilidades = this.listaHabilidades.filter(x => x !== h);
    this.requisitosData.habilidades = this.requisitosData.habilidades.filter(x => x !== h);
  }

  /* ---------------- Badges: certs ---------------- */

  toggleCertificacion(c: string) {
    const i = this.requisitosData.certificaciones.indexOf(c);
    i > -1 ? this.requisitosData.certificaciones.splice(i, 1) : this.requisitosData.certificaciones.push(c);
    if (!this.listaCertificaciones.includes(c)) this.listaCertificaciones.push(c);
    this.requisitosData.certificaciones = this.uniq(this.requisitosData.certificaciones);
    this.listaCertificaciones = this.uniq(this.listaCertificaciones);
  }
  mostrarInputCertificacion() { this.agregandoCert = true; }
  cancelarAgregarCertificacion() { this.agregandoCert = false; }
  agregarCertificacion(valor: string) {
    const t = valor.trim();
    if (t) {
      this.listaCertificaciones.push(t);
      this.requisitosData.certificaciones.push(t);
      this.listaCertificaciones = this.uniq(this.listaCertificaciones);
      this.requisitosData.certificaciones = this.uniq(this.requisitosData.certificaciones);
    }
    this.agregandoCert = false;
  }
  eliminarCertificacion(c: string) {
    this.listaCertificaciones = this.listaCertificaciones.filter(x => x !== c);
    this.requisitosData.certificaciones = this.requisitosData.certificaciones.filter(x => x !== c);
  }

  /* ---------------- Build payload & submit ---------------- */

  private buildPuestoFromForm(): PuestoDeTrabajo {
    const raw = this.formularioPuesto.getRawValue();

    const requisitosVisible = [
      raw.experiencia,
      this.requisitosData.competencias.join(', '),
      this.requisitosData.habilidades.join(', '),
      this.requisitosData.certificaciones.join(', ')
    ].filter(Boolean).join('\n');

    const puesto: PuestoDeTrabajo = {
      ...raw,
      idPuesto: this.modoEdicion ? this.idPuesto : 0,
      requisitos: requisitosVisible,
      experiencia: raw.experiencia,
      educacion: raw.educacion || '',
      habilidadesTecnicas: this.requisitosData.competencias.join(', '),
      habilidadesBlandas:  this.requisitosData.habilidades.join(', '),
      certificaciones:     this.requisitosData.certificaciones.join(', '),
      // campos opcionales
      empresa: undefined as any,
      setEmbExperiencia: '[]',
      setEmbEducacion: '[]',
      setEmbHabTec: '[]',
      setEmbHabBlandas: '[]',
      setEmbCertificaciones: '[]'
    };

    console.log('📦 Payload de puesto listo:', puesto);
    return puesto;
  }

  guardarPuesto() {
    if (this.formularioPuesto.invalid || this.competenciasInvalidas || this.habilidadesInvalidas) {
      this.formularioPuesto.markAllAsTouched();
      console.warn('⚠️ Formulario inválido o badges incompletos');
      return;
    }

    const puesto = this.buildPuestoFromForm();

    if (this.modoEdicion) {
      console.log('🚀 PUT registrarPuesto() con idPuesto:', this.idPuesto);
      this.recomendacion.registrarPuesto(puesto).subscribe({
        next: (resp) => {
          console.log('✅ Respuesta backend (PUT):', resp);
          this.snackbar.open('Puesto actualizado correctamente', 'Cerrar', {
            duration: 3000, panelClass: ['snackbar-success']
          });
        },
        error: (err) => {
          console.error('🚨 Error al actualizar el puesto', err);
          this.snackbar.open('Error al actualizar el puesto', 'Cerrar', {
            duration: 3000, panelClass: ['snackbar-error']
          });
        }
      });
    } else {
      console.log('🚀 POST registroPuesto() (modo creación)');
      this.recomendacion.registroPuesto(puesto).subscribe({
        next: (resp) => {
          console.log('✅ Respuesta backend (POST):', resp);
          // reset a valores base
          this.formularioPuesto.reset({ pais: 'Perú', departamento: 'Lima' });
          this.requisitosData = { competencias: [], habilidades: [], certificaciones: [] };
          this.listaCompetencias = []; this.listaHabilidades = []; this.listaCertificaciones = [];
          this.snackbar.open('Oferta creada exitosamente', 'Cerrar', {
            duration: 3000, panelClass: ['snackbar-success']
          });
        },
        error: (err) => {
          console.error('🚨 Error al crear la oferta', err);
          this.snackbar.open('Error al crear la oferta', 'Cerrar', {
            duration: 3000, panelClass: ['snackbar-error']
          });
        }
      });
    }
  }
}
