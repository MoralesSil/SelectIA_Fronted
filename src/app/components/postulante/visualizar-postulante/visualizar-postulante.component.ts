import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UsuarioService } from '../../../services/usuario.service';
import { PerfilPostulanteService } from '../../../services/perfil-postulante.service';
import { PerfilPostulante } from '../../../models/perfil-postulante';
import { Usuario } from '../../../models/usuario';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-visualizar-postulante',
  templateUrl: './visualizar-postulante.component.html',
  imports: [CommonModule, MatIconModule],
  styleUrls: ['./visualizar-postulante.component.css'],
})
export class VisualizarPostulanteComponent implements OnInit {
  usuario: Usuario = new Usuario();
  perfilPostulante?: PerfilPostulante;

  // Arrays para chips
  habilidadesTecnicasArr: string[] = [];
  habilidadesBlandasArr: string[] = [];
  certificacionesArr: string[] = [];

  mostrarPdf = false;
  cvSanitizadoUrl?: SafeResourceUrl;

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private perfilPostulanteService: PerfilPostulanteService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.usuarioService.buscarPorId(Number(id)).subscribe(usuario => {
      this.usuario = usuario;

      if (usuario?.idUsuario != null) {
        this.perfilPostulanteService.buscarPorUsuario(usuario.idUsuario).subscribe(perfil => {
          this.perfilPostulante = perfil || undefined;
          this.habilidadesTecnicasArr = this.toChipArray(perfil?.habilidadesTecnicas);
          this.habilidadesBlandasArr = this.toChipArray(perfil?.habilidadesBlandas);
          this.certificacionesArr   = this.toChipArray(perfil?.certificaciones);
        });
      }
    });
  }

  private toChipArray(value?: string | null): string[] {
    if (!value) return [];
    return value
      .split(/[,\n;]/g)                // coma, salto de línea o punto y coma
      .map(v => v.trim())
      .filter(v => v.length > 0)
      .slice(0, 60);                  // límite defensivo
  }

  abrirPdf(url: string) {
    fetch(url, { method: 'HEAD' })
      .then(res => {
        const contentType = res.headers.get('Content-Type');
        if (contentType && contentType.includes('pdf')) {
          this.cvSanitizadoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          this.mostrarPdf = true;
        } else {
          window.open(url, '_blank');
        }
      })
      .catch(() => window.open(url, '_blank'));
  }

  cerrarPdf() {
    this.mostrarPdf = false;
    this.cvSanitizadoUrl = undefined;
  }
}
