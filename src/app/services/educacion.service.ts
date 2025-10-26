import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Educacion } from '../models/educacion';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class EducacionService {
  private url = `${base_url}/api/educaciones`;

  constructor(private http: HttpClient) {}

  // Insertar educación (POST)
  insertar(educacion: Educacion): Observable<any> {
    return this.http.post(this.url, educacion);
  }

  // Listar todas las educaciones (GET)
  listar(): Observable<Educacion[]> {
    return this.http.get<Educacion[]>(this.url);
  }

  // Buscar educación por ID (GET)
  buscarPorId(id: number): Observable<Educacion> {
    return this.http.get<Educacion>(`${this.url}/${id}`);
  }

  // Eliminar educación por ID (DELETE)
  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
