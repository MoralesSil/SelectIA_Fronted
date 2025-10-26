import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule, ApexChart, ApexPlotOptions } from 'ng-apexcharts';
import { CandidatoRanking } from '../../models/candidato-ranking';
import { ActivatedRoute, Router } from '@angular/router';
import { RecomendacionService } from '../../services/recomendacion.service';
import { OfertaLaboral } from '../../models/oferta-laboral';
import { OfertaLaboralService } from '../../services/oferta-laboral.service';
import { UsuarioService } from '../../services/usuario.service';
import { PostulacionService } from '../../services/postulacion.service';
import { VerPostulacion } from '../../models/VerPostulacion';

type AtribKey =
  | 'experiencia'
  | 'educacion'
  | 'habilidades_tecnicas'
  | 'habilidades_blandas'
  | 'certificaciones';

@Component({
  selector: 'app-dashboards',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.css']
})
export class DashboardsComponent implements OnInit {
  candidatos: CandidatoRanking[] = [];
  totalPostulantes = 0;
  oferta?: OfertaLaboral;
  puntajePromedio = 0;

  // Gráfico de barras
  barChartSeries: any[] = [];
  barChartOptions: any = {
    chart: { type: 'bar', height: 350 },
    xaxis: { categories: [] },
    plotOptions: {
      bar: { horizontal: false, columnWidth: '50%', borderRadius: 5 }
    },
    dataLabels: { enabled: false },
    tooltip: { y: { formatter: (val: any) => `${val} %` } },
    colors: ['#0B4C28'],
    stroke: { show: true, width: 2, colors: ['transparent'] }
  };

  // Donut (edades)
  donutSeries: number[] = [];
  donutChartOptions: any = {
    series: [],
    chart: { type: 'donut', height: 200 },
    labels: ['18-25 años', '26-35 años', '36+ años'],
    colors: ['#836FFF', '#FF6384', '#164C36'],
    legend: { show: true, position: 'bottom' },
    tooltip: { y: { formatter: (val: any) => `${val} postulantes` } }
  };

  // Radial principal (promedio)
  radialSeries: number[] = [];
  radialChartOptions: any = {
    series: [],
    chart: { type: 'radialBar', height: 200 },
    plotOptions: {
      radialBar: {
        hollow: { size: '70%' },
        dataLabels: {
          name: { show: true },
          value: { show: true, formatter: (val: any) => `${val}%` }
        }
      }
    },
    colors: ['#0B4C28'],
    labels: ['Promedio']
  };

  // Línea (tendencia registros)
  lineSeries: any[] = [];
  lineChartOptions: any = {
    chart: { type: 'line', height: 250 },
    xaxis: { categories: [] },
    stroke: { curve: 'smooth' },
    dataLabels: { enabled: false },
    colors: ['#0B4C28'],
    tooltip: { y: { formatter: (val: any) => `${val} postulantes` } }
  };

  // === NUEVO: atributos para explicabilidad
  atributos: { key: AtribKey; label: string }[] = [
    { key: 'experiencia',           label: 'Experiencia' },
    { key: 'educacion',             label: 'Educación' },
    { key: 'habilidades_tecnicas',  label: 'Hab. Técnicas' },
    { key: 'habilidades_blandas',   label: 'Hab. Blandas' },
    { key: 'certificaciones',       label: 'Certificaciones' },
  ];

  // === NUEVO: estado de filas expandidas
  private expanded = new Set<string>();

  // === NUEVO: radial mini para cada atributo
  radialMini = {
    chart: { type: 'radialBar', height: 150 } as ApexChart,
    plotOptions: {
      radialBar: {
        hollow: { size: '65%' },
        dataLabels: {
          name: { show: false },
          value: { show: true, formatter: (val: any) => `${val}%` }
        }
      }
    } as ApexPlotOptions,
    colors: ['#0B4C28']
  };

  cargandoEdades = false;

  constructor(
    private route: ActivatedRoute,
    private recomendacionService: RecomendacionService,
    private ofertaService: OfertaLaboralService,
    private usuarioService: UsuarioService,
    private postulacionService: PostulacionService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idOferta = Number(params.get('id'));
      if (idOferta) {
        this.ofertaService.buscarPorId(idOferta).subscribe(oferta => this.oferta = oferta);
        this.cargarRanking(idOferta);
      }
    });
  }

  cargarRanking(idOferta: number): void {
    this.recomendacionService.rankCandidatosPorOferta(idOferta).subscribe(data => {
      // data.totalScore ya viene 0–100 desde el backend (tu micro)
      this.candidatos = data;
      this.totalPostulantes = this.candidatos.length;
      this.puntajePromedio = this.calcularPromedio();

      this.actualizarBarChart(this.candidatos);
      this.actualizarDonut(this.candidatos);

      this.radialSeries = [Math.round(this.puntajePromedio)];
      this.radialChartOptions.series = this.radialSeries;

      this.generarTendenciaRegistros(idOferta);
    });
  }

  actualizarBarChart(lista: CandidatoRanking[]): void {
    this.barChartOptions.xaxis = { categories: lista.map(c => c.username) };
    this.barChartSeries = [
      { name: 'Puntaje Obtenido', data: lista.map(c => Math.round(c.totalScore)) }
    ];
  }

  // Edad
  calcularEdad(fechaNacimiento: string | Date): number {
    const nacimiento = typeof fechaNacimiento === 'string' ? new Date(fechaNacimiento) : fechaNacimiento;
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
  }

  actualizarDonut(lista: CandidatoRanking[]): void {
    let edad18a25 = 0, edad26a35 = 0, edad36mas = 0;
    let consultados = 0;
    this.cargandoEdades = true;

    if (!lista.length) {
      this.donutSeries = [0, 0, 0];
      this.donutChartOptions.series = this.donutSeries;
      this.cargandoEdades = false;
      return;
    }

    lista.forEach(c => {
      this.usuarioService.buscarPorUsername(c.username).subscribe(usuario => {
        if (usuario?.fechadeNacimiento) {
          const edad = this.calcularEdad(usuario.fechadeNacimiento);
          if (edad <= 25) edad18a25++;
          else if (edad <= 35) edad26a35++;
          else edad36mas++;
        }
        consultados++;
        if (consultados === lista.length) {
          this.donutSeries = [edad18a25, edad26a35, edad36mas];
          this.donutChartOptions.series = this.donutSeries;
          this.cargandoEdades = false;
        }
      }, _ => {
        consultados++;
        if (consultados === lista.length) {
          this.donutSeries = [edad18a25, edad26a35, edad36mas];
          this.donutChartOptions.series = this.donutSeries;
          this.cargandoEdades = false;
        }
      });
    });
  }

  generarTendenciaRegistros(ofertaId: number): void {
    this.postulacionService.buscarPorOfertaLaboral(ofertaId).subscribe((postulaciones: VerPostulacion[]) => {
      const conteoDias = [0, 0, 0, 0, 0, 0, 0]; // Dom..Sáb

      postulaciones.forEach(post => {
        const fecha = new Date(post.fechaPostulacion);
        const dia = fecha.getDay(); // 0:Dom .. 6:Sáb
        conteoDias[dia]++;
      });

      const diasOrden = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
      const conteoOrden = [conteoDias[1], conteoDias[2], conteoDias[3], conteoDias[4], conteoDias[5], conteoDias[6], conteoDias[0]];

      this.lineChartOptions.xaxis = { categories: diasOrden };
      this.lineSeries = [{ name: 'Postulantes Registrados', data: conteoOrden }];
    });
  }

  calcularPromedio(): number {
    if (!this.candidatos.length) return 0;
    const sum = this.candidatos.reduce((a, c) => a + (c.totalScore || 0), 0);
    return Math.round((sum / this.candidatos.length) * 100) / 100; // 0–100 con 2 decimales
  }

  filtrarCandidatos(event: Event): void {
    const filtro = (event.target as HTMLSelectElement).value;

    if (filtro === 'Todos') {
      this.actualizarBarChart(this.candidatos);
    } else if (filtro === 'Top 7') {
      const top7 = [...this.candidatos].sort((a, b) => b.totalScore - a.totalScore).slice(0, 7);
      this.actualizarBarChart(top7);
    } else if (filtro === '>= 80') {
      const filtrados = this.candidatos.filter(c => c.totalScore >= 80);
      this.actualizarBarChart(filtrados);
    } else if (filtro === '>= 50') {
      const filtrados = this.candidatos.filter(c => c.totalScore >= 50);
      this.actualizarBarChart(filtrados);
    }
  }

  verPerfil(candidato: CandidatoRanking): void {
    this.usuarioService.buscarPorUsername(candidato.username).subscribe(usuario => {
      if (usuario?.idUsuario != null) this.router.navigate(['/postulante', usuario.idUsuario]);
      else alert('No se pudo encontrar el usuario');
    }, _ => alert('Error al obtener el usuario'));
  }

  // ====== NUEVO: Explicabilidad ======

  toggleDetalle(c: CandidatoRanking): void {
    const key = c.username;
    if (this.expanded.has(key)) this.expanded.delete(key);
    else this.expanded.add(key);
  }

  isExpanded(c: CandidatoRanking): boolean {
    return this.expanded.has(c.username);
  }

  getScore(c: CandidatoRanking, key: AtribKey): number {
    switch (key) {
      case 'experiencia':           return Math.round(c.experienciaScore ?? 0);
      case 'educacion':             return Math.round(c.educacionScore ?? 0);
      case 'habilidades_tecnicas':  return Math.round(c.habilidadesTecScore ?? 0);
      case 'habilidades_blandas':   return Math.round(c.habilidadesBlandasScore ?? 0);
      case 'certificaciones':       return Math.round(c.certificacionesScore ?? 0);
    }
  }

  getExplicacion(c: CandidatoRanking, key: AtribKey): string {
    // c.explicaciones es un Map<string, string> (o Record<string,string>)
    // las claves vienen del micro: experiencia, educacion, habilidades_tecnicas, habilidades_blandas, certificaciones
    const mapa = c.explicaciones as any;
    return (mapa && mapa[key]) ? mapa[key] : 'Sin explicación disponible.';
  }

  // === Carga global elegante ===
loading = true;
private loaded = { ranking: false, edades: false, tendencia: false };

private checkLoading(): void {
  const allDone = this.loaded.ranking && this.loaded.edades && this.loaded.tendencia;
  this.loading = !allDone;
}

}
