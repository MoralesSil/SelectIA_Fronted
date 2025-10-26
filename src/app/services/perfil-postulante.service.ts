import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PerfilPostulante } from '../models/perfil-postulante';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class PerfilPostulanteService {
  private url = `${base_url}/api/perfiles-postulante`;

  constructor(private http: HttpClient) {}

  // Insertar perfil postulante (POST)
  insertar(perfil: PerfilPostulante): Observable<any> {
    return this.http.post(this.url, perfil);
  }

  // Listar todos los perfiles postulante (GET)
  listar(): Observable<PerfilPostulante[]> {
    return this.http.get<PerfilPostulante[]>(this.url);
  }

  // Buscar perfil postulante por ID (GET)
  buscarPorId(id: number): Observable<PerfilPostulante> {
    return this.http.get<PerfilPostulante>(`${this.url}/${id}`);
  }

  // Eliminar perfil postulante por ID (DELETE)
  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  // Buscar perfil postulante por usuario (GET /usuario/{idUsuario})
  buscarPorUsuario(idUsuario: number): Observable<PerfilPostulante> {
    return this.http.get<PerfilPostulante>(`${this.url}/usuario/${idUsuario}`);
  }
}
