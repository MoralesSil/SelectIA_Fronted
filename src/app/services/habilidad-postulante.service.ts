import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HabilidadPostulante } from '../models/habilidad-postulante';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class HabilidadPostulanteService {
  private url = `${base_url}/api/habilidad-postulante`;

  constructor(private http: HttpClient) {}

  // Insertar habilidad-postulante (POST)
  insertar(habilidadPostulante: HabilidadPostulante): Observable<any> {
    return this.http.post(this.url, habilidadPostulante);
  }

  // Listar todas las habilidades-postulante (GET)
  listar(): Observable<HabilidadPostulante[]> {
    return this.http.get<HabilidadPostulante[]>(this.url);
  }

  // Buscar habilidad-postulante por ID (GET)
  buscarPorId(id: number): Observable<HabilidadPostulante> {
    return this.http.get<HabilidadPostulante>(`${this.url}/${id}`);
  }

  // Eliminar habilidad-postulante por ID (DELETE)
  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
