import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
// Si tienes un modelo PerfilReclutador:
import { PerfilReclutador } from '../models/perfil-reclutador';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class PerfilReclutadorService {
  private url = `${base_url}/api/perfiles-reclutador`;

  constructor(private http: HttpClient) {}

  // Insertar perfil reclutador (POST)
  insertar(perfil: PerfilReclutador): Observable<any> {
    return this.http.post(this.url, perfil);
  }

  // Listar todos los perfiles reclutador (GET)
  listar(): Observable<PerfilReclutador[]> {
    return this.http.get<PerfilReclutador[]>(this.url);
  }

  // Buscar perfil reclutador por ID (GET)
  buscarPorId(id: number): Observable<PerfilReclutador> {
    return this.http.get<PerfilReclutador>(`${this.url}/${id}`);
  }

  // Eliminar perfil reclutador por ID (DELETE)
  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
