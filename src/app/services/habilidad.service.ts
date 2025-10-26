import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Habilidad } from '../models/habilidad';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class HabilidadService {
  private url = `${base_url}/api/habilidad`;

  constructor(private http: HttpClient) {}

  // Insertar habilidad (POST)
  insertar(habilidad: Habilidad): Observable<any> {
    return this.http.post(this.url, habilidad);
  }

  // Listar todas las habilidades (GET)
  listar(): Observable<Habilidad[]> {
    return this.http.get<Habilidad[]>(this.url);
  }

  // Buscar habilidad por ID (GET)
  buscarPorId(id: number): Observable<Habilidad> {
    return this.http.get<Habilidad>(`${this.url}/${id}`);
  }

  // Eliminar habilidad por ID (DELETE)
  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
