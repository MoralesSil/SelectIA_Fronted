import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Postulacion } from '../models/postulacion';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { VerPostulacion } from '../models/VerPostulacion';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class PostulacionService {
  private url = `${base_url}/api/postulaciones`;

  constructor(private http: HttpClient) {}

  // Insertar postulación (POST)
  insertar(postulacion: Postulacion): Observable<any> {
    return this.http.post(this.url, postulacion);
  }

  // Listar todas las postulaciones (GET)
  listar(): Observable<Postulacion[]> {
    return this.http.get<Postulacion[]>(this.url);
  }

  // Buscar postulación por ID (GET)
  buscarPorId(id: number): Observable<Postulacion> {
    return this.http.get<Postulacion>(`${this.url}/${id}`);
  }

  // Eliminar postulacion por ID (DELETE)
  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  // Buscar postulaciones por perfil postulante (GET /perfil-postulante/{perfilId})
  buscarPorPerfilPostulante(perfilId: number): Observable<VerPostulacion[]> {
    return this.http.get<VerPostulacion[]>(`${this.url}/perfil-postulante/${perfilId}`);
  }
  // Buscar postulaciones por oferta laboral (GET /oferta-laboral/{ofertaId})
  buscarPorOfertaLaboral(ofertaId: number): Observable<VerPostulacion[]> {
    return this.http.get<VerPostulacion[]>(`${this.url}/oferta-laboral/${ofertaId}`);
  }

  // Verificar si existe una postulación con ese perfil y oferta
  existePostulacion(idUsuario: number, idOferta: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/existe`, {
        params: {
          idUsuario: idUsuario.toString(),
          idOferta: idOferta.toString()
        }
      });
  }

}
