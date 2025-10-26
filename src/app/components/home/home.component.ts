import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    MatIcon,
    CommonModule,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  secciones = [
    {
      icon: 'work',
      titulo: 'Crear Puesto de Trabajo',
      descripcion: 'Define un perfil laboral base que servirá como plantilla para ofertas futuras.',
      detalle: 'Aquí configuras los requisitos, funciones y habilidades requeridas para un puesto específico. No se publica directamente, pero es esencial para crear ofertas relacionadas.',
      ruta: '/crearoferta'
    },
    {
      icon: 'post_add',
      titulo: 'Crear Oferta de Trabajo',
      descripcion: 'Lanza una nueva oferta basada en un puesto ya creado.',
      detalle: 'Una oferta es una publicación activa con fecha de inicio y fin, y cantidad de vacantes. Puedes usar el mismo puesto para lanzar varias ofertas en diferentes periodos.',
      ruta: '/crearoferta2'
    },
    {
      icon: 'campaign',
      titulo: 'Ofertas Publicadas',
      descripcion: 'Monitorea tus publicaciones activas y finalizadas.',
      detalle: 'Desde aquí puedes editar, pausar o cerrar procesos, revisando candidatos en tiempo real.',
      ruta: '/oferta'
    },
    {
      icon: 'smart_toy',
      titulo: 'Candidatos por IA',
      descripcion: 'Nuestra IA te sugiere candidatos ideales.',
      detalle: 'Compara automáticamente requisitos del puesto con perfiles y destaca los más compatibles.',
      ruta: '/oferta'
    },
    {
      icon: 'analytics',
      titulo: 'Estadísticas y Reportes',
      descripcion: 'Visualiza el rendimiento de tus ofertas.',
      detalle: 'Evalúa métricas como postulantes, tasa de conversión y tiempos promedio de contratación.',
      ruta: '/oferta'
    }
  ];
}
