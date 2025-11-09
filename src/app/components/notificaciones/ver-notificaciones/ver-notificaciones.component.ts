import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OfertaLaboralService } from '../../../services/oferta-laboral.service';
import { OfertaLaboral } from '../../../models/oferta-laboral';

@Component({
  selector: 'app-ver-notificaciones',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ver-notificaciones.component.html',
  styleUrl: './ver-notificaciones.component.css'
})
export class VerNotificacionesComponent implements OnInit {
  ofertasCerradas: OfertaLaboral[] = [];

  constructor(private ofertaService: OfertaLaboralService) {}

  ngOnInit(): void {
    const hoy = new Date();
    this.ofertaService.listar().subscribe((ofertas) => {
      this.ofertasCerradas = ofertas.filter(
        (oferta) => oferta.estado === false || new Date(oferta.fechaCulminacion) < hoy
      );
    });
  }
}
