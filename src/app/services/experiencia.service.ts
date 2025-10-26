import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Experiencia } from '../models/experiencia';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class ExperienciaService {
  private url = `${base_url}/api/experiencias`;

  constructor(private http: HttpClient) {}

  // Insertar experiencia (POST)
  insertar(experiencia: Experiencia): Observable<any> {
    return this.http.post(this.url, experiencia);
  }

  // Listar todas las experiencias (GET)
  listar(): Observable<Experiencia[]> {
    return this.http.get<Experiencia[]>(this.url);
  }

  // Buscar experiencia por ID (GET)
  buscarPorId(id: number): Observable<Experiencia> {
    return this.http.get<Experiencia>(`${this.url}/${id}`);
  }

  // Eliminar experiencia por ID (DELETE)
  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
