import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PuestoDeTrabajo } from '../models/puesto-de-trabajo';
import { PerfilPostulante } from '../models/perfil-postulante';
import { CandidatoRanking } from '../models/candidato-ranking';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class RecomendacionService {
  private url = `${base_url}/recomendacion`;

  constructor(private http: HttpClient) {}

  // Recalcular embedding de un perfil postulante (PUT)
  recalcularEmbedding(id: number): Observable<any> {
    return this.http.put(`${this.url}/perfil-postulante/${id}/embedding`, {});
  }

  // Registrar puesto de trabajo y calcular embedding (PUT)
  registrarPuesto(puesto: PuestoDeTrabajo): Observable<any> {
  return this.http.put(`${this.url}/puesto`, puesto, {
    responseType: 'text' as 'json'  // <- evita que HttpClient intente parsear JSON
  });
}

  // Registrar puesto de trabajo y calcular embedding (PUT)
  registroPuesto(puesto: PuestoDeTrabajo): Observable<any> {
    return this.http.post(`${this.url}/puesto`, puesto);
  }

  // Ranking de candidatos por oferta (GET)
  rankCandidatosPorOferta(idOferta: number): Observable<CandidatoRanking[]> {
    return this.http.get<CandidatoRanking[]>(`${this.url}/rank/oferta/${idOferta}`);
  }

  // Registrar perfil postulante con URL de CV (POST)
  registerPerfilPostulante(usuarioId: number, cvUrl: string): Observable<any> {
  const body = new HttpParams().set('usuarioId', usuarioId).set('cvUrl', cvUrl);
  return this.http.post(
    `${this.url}/perfilpostulante/register`,
    body.toString(),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, responseType: 'text' as 'json' }
  );
}

actualizarPerfilPostulantePorUsuario(idUsuario: number, cvUrl: string): Observable<any> {
  const body = new HttpParams().set('cvUrl', cvUrl);
  return this.http.put(
    `${this.url}/perfilpostulante/update/${idUsuario}`,
    body.toString(),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, responseType: 'text' as 'json' }
  );
}


  // Actualizar campos de perfil y recalcular embedding (PUT)
  actualizarCamposPerfilPostulante(perfil: PerfilPostulante): Observable<any> {
      const body = {
      idPerfil: perfil.idPerfil,
      idUsuario: perfil.usuario.idUsuario, // ← el ID plano
      cvUrl: perfil.cvUrl,
      textoExtraido: perfil.textoExtraido,
      habilidadesBlandas: perfil.habilidadesBlandas,
      habilidadesTecnicas: perfil.habilidadesTecnicas,
      educacion: perfil.educacion,
      experiencia: perfil.experiencia,
      embeddingVector: perfil.embeddingVector,
    };
    return this.http.put(`${this.url}/perfilpostulante/update-campos`, body);
  }

  crearPerfilPostulante(perfil: PerfilPostulante): Observable<any> {
      const body = {
      idPerfil: perfil.idPerfil,
      idUsuario: perfil.usuario.idUsuario,
      cvUrl: perfil.cvUrl,
      textoExtraido: perfil.textoExtraido,
      habilidadesBlandas: perfil.habilidadesBlandas,
      habilidadesTecnicas: perfil.habilidadesTecnicas,
      educacion: perfil.educacion,
      experiencia: perfil.experiencia,
      embeddingVector: perfil.embeddingVector,
    };
    return this.http.post(`${this.url}/perfilpostulante/create`, body);
  }


}
