import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PuestoDeTrabajo } from '../../../models/puesto-de-trabajo';
import { OfertaLaboralService } from '../../../services/oferta-laboral.service';
import { PuestoDeTrabajoService } from '../../../services/puesto-de-trabajo.service';
import { OfertaLaboral } from '../../../models/oferta-laboral';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-crearofertalaboral',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './crearofertalaboral.component.html',
  styleUrl: './crearofertalaboral.component.css'
})
export class CrearofertalaboralComponent implements OnInit {
  formularioOferta: FormGroup;
  puestos: PuestoDeTrabajo[] = [];
  loading = false;
  successMsg = '';
  errorMsg = '';
  formSubmitted = false;

  esEdicion = false;
  ofertaId?: number;

  constructor(
    private fb: FormBuilder,
    private puestoService: PuestoDeTrabajoService,
    private ofertaService: OfertaLaboralService,
    private route: ActivatedRoute
  ) {
    this.formularioOferta = this.fb.group({
      vacantes: [1, [Validators.required, Validators.min(1)]],
      puestoDeTrabajo: ['', Validators.required],
      fechaCulminacion: ['', Validators.required],
      estado: [true] // se usará solo cuando es edición (visible con *ngIf)
    });
  }

  ngOnInit(): void {
    // Cargar puestos
    this.puestoService.listar().subscribe({
      next: (puestos) => (this.puestos = puestos),
      error: () => (this.errorMsg = 'Error al cargar puestos de trabajo')
    });

    // Ver si hay ID en la ruta (modo edición)
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.esEdicion = true;
      this.ofertaId = +idParam;
      this.cargarOferta(this.ofertaId);
    }
  }

  private cargarOferta(id: number): void {
    this.ofertaService.buscarPorId(id).subscribe({
      next: (oferta) => {
        // Convertir fecha a formato yyyy-MM-dd para el input date
        const fecha = new Date(oferta.fechaCulminacion);
        const fechaStr = fecha.toISOString().substring(0, 10);

        this.formularioOferta.patchValue({
          vacantes: oferta.vacantes,
          puestoDeTrabajo: oferta.puestoDeTrabajo?.idPuesto,
          fechaCulminacion: fechaStr,
          estado: oferta.estado
        });
      },
      error: () => {
        this.errorMsg = 'Error al cargar la oferta.';
      }
    });
  }

  guardarOferta(): void {
    this.formSubmitted = true;
    this.successMsg = '';
    this.errorMsg = '';

    if (this.formularioOferta.invalid) {
      this.formularioOferta.markAllAsTouched();
      return;
    }

    this.loading = true;

    const formValue = this.formularioOferta.value;
    const oferta: OfertaLaboral = new OfertaLaboral();

    if (this.esEdicion && this.ofertaId) {
      (oferta as any).idOferta = this.ofertaId;
    }

    oferta.vacantes = formValue.vacantes;

    oferta.puestoDeTrabajo = new PuestoDeTrabajo();
    oferta.puestoDeTrabajo.idPuesto = formValue.puestoDeTrabajo;

    oferta.fechaCreacion = new Date(); // si tu backend usa la original, puedes omitir o manejar aparte

    // estado:
    oferta.estado = this.esEdicion ? formValue.estado : true;

    (oferta as any).perfilReclutador = { idReclutador: 1 };

    oferta.fechaCulminacion = new Date(formValue.fechaCulminacion);

    if (this.esEdicion && this.ofertaId) {
      // ACTUALIZAR
      this.ofertaService.actualizar(this.ofertaId, oferta).subscribe({
        next: () => {
          this.successMsg = 'Oferta actualizada exitosamente.';
          this.loading = false;
        },
        error: () => {
          this.errorMsg = 'Error al actualizar la oferta.';
          this.loading = false;
        }
      });
    } else {
      // CREAR
      this.ofertaService.insertar(oferta).subscribe({
        next: () => {
          this.successMsg = 'Oferta creada exitosamente.';
          this.formularioOferta.reset();
          // resetear a valores por defecto
          this.formularioOferta.patchValue({ vacantes: 1, estado: true });
          this.formSubmitted = false;
          this.loading = false;
        },
        error: () => {
          this.errorMsg = 'Error al crear oferta.';
          this.loading = false;
        }
      });
    }
  }
}
