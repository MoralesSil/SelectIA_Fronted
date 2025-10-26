import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OfertaLaboral } from '../models/oferta-laboral';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class OfertaLaboralService {
  private url = `${base_url}/api/ofertas-laborales`;

  constructor(private http: HttpClient) {}

  // Insertar oferta laboral (POST)
  insertar(oferta: OfertaLaboral): Observable<any> {
    return this.http.post(this.url, oferta);
  }

  // Listar todas las ofertas laborales (GET)
  listar(): Observable<OfertaLaboral[]> {
    return this.http.get<OfertaLaboral[]>(this.url);
  }

  // Buscar oferta laboral por ID (GET)
  buscarPorId(id: number): Observable<OfertaLaboral> {
    return this.http.get<OfertaLaboral>(`${this.url}/${id}`);
  }

  // Eliminar oferta laboral por ID (DELETE)
  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  // Buscar ofertas laborales por estado (GET /estado/{estado})
  buscarPorEstado(estado: boolean): Observable<OfertaLaboral[]> {
    return this.http.get<OfertaLaboral[]>(`${this.url}/estado/${estado}`);
  }
}
