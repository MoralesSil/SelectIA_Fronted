import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PuestoDeTrabajo } from '../../../models/puesto-de-trabajo';
import { OfertaLaboralService } from '../../../services/oferta-laboral.service';
import { PuestoDeTrabajoService } from '../../../services/puesto-de-trabajo.service';
import { OfertaLaboral } from '../../../models/oferta-laboral';
import { CommonModule } from '@angular/common';

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

  constructor(
    private fb: FormBuilder,
    private puestoService: PuestoDeTrabajoService,
    private ofertaService: OfertaLaboralService
  ) {
    this.formularioOferta = this.fb.group({
      vacantes: [1, [Validators.required, Validators.min(1)]],
      puestoDeTrabajo: ['', Validators.required],
      fechaCulminacion: ['', Validators.required], // <--- NUEVO
    });

  }

  ngOnInit(): void {
    // Trae todos los puestos
    this.puestoService.listar().subscribe({
      next: (puestos) => this.puestos = puestos,
      error: () => this.errorMsg = 'Error al cargar puestos de trabajo'
    });
  }

  crearOferta(): void {
    if (this.formularioOferta.invalid) return;

    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';

    // Construir la oferta
    const oferta: OfertaLaboral = new OfertaLaboral();
    oferta.vacantes = this.formularioOferta.value.vacantes;
    oferta.puestoDeTrabajo.idPuesto = this.formularioOferta.value.puestoDeTrabajo; // Solo id
    oferta.fechaCreacion = new Date();
    oferta.estado = true;
    oferta.perfilReclutador.idReclutador = 1; // fijo
    oferta.fechaCulminacion = new Date(this.formularioOferta.value.fechaCulminacion); // <--- NUEVO


    this.ofertaService.insertar(oferta).subscribe({
      next: () => {
        this.successMsg = 'Oferta creada exitosamente.';
        this.formularioOferta.reset();
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Error al crear oferta.';
        this.loading = false;
      }
    });
  }
}
