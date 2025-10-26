import { Component, OnInit } from '@angular/core';
import { PuestoDeTrabajo } from '../../../models/puesto-de-trabajo';
import { PuestoDeTrabajoService } from '../../../services/puesto-de-trabajo.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { OfertaLaboralService } from '../../../services/oferta-laboral.service';
import { OfertaLaboral } from '../../../models/oferta-laboral';

@Component({
  selector: 'app-veroferta',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './veroferta.component.html',
  styleUrl: './veroferta.component.css'
})
export class VerofertaComponent implements OnInit {
  ofertasRecientes: OfertaLaboral[] = [];
  ofertasActivas: OfertaLaboral[] = [];
  ofertasCulminadas: OfertaLaboral[] = [];

  constructor(
    private puestoService: PuestoDeTrabajoService,
    private OfertaLaboralService: OfertaLaboralService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('VerofertaComponent ngOnInit');

    this.OfertaLaboralService.listar().subscribe((puestos) => {
      console.log("LISTA COMPLETA DE PUESTOS:", puestos);
      this.ofertasRecientes = puestos;

      const hoy = new Date();

      // Clasificamos las ofertas
      this.ofertasActivas = puestos.filter(oferta => new Date(oferta.fechaCulminacion) >= hoy);
      this.ofertasCulminadas = puestos.filter(oferta => new Date(oferta.fechaCulminacion) < hoy);
    });
  }

  extraerExperiencia(requisitos: string): string {
    const match = requisitos.match(/Experiencia:\s*([^\n\r]+)/i);
    return match?.[1]?.trim() || 'Sin experiencia';
  }

  verEstadisticas(oferta: PuestoDeTrabajo) {
    this.router.navigate(['/dashboards', oferta.idPuesto]);
  }

  scrollLeft(tipo: string) {
    if (tipo === 'activas') {
      const container = document.querySelector('.carousel-track') as HTMLElement;
      container.scrollBy({ left: -320, behavior: 'smooth' });
    } else if (tipo === 'culminadas') {
      const container = document.querySelectorAll('.carousel-track')[1] as HTMLElement;
      container.scrollBy({ left: -320, behavior: 'smooth' });
    }
  }

  scrollRight(tipo: string) {
    if (tipo === 'activas') {
      const container = document.querySelector('.carousel-track') as HTMLElement;
      container.scrollBy({ left: 320, behavior: 'smooth' });
    } else if (tipo === 'culminadas') {
      const container = document.querySelectorAll('.carousel-track')[1] as HTMLElement;
      container.scrollBy({ left: 320, behavior: 'smooth' });
    }
  }
}

