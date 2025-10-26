import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PuestoDeTrabajo } from '../models/puesto-de-trabajo';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class PuestoDeTrabajoService {
  private url = `${base_url}/api/puestos`;

  constructor(private http: HttpClient) {}

  // Insertar puesto de trabajo (POST)
  insertar(puesto: PuestoDeTrabajo): Observable<any> {
    return this.http.post(this.url, puesto);
  }

  // Listar todos los puestos de trabajo (GET)
  listar(): Observable<PuestoDeTrabajo[]> {
    return this.http.get<PuestoDeTrabajo[]>(this.url);
  }

  buscarPorId(id: number): Observable<PuestoDeTrabajo> {
    return this.http.get<PuestoDeTrabajo>(`${this.url}/${id}`);
  }
  

  // Eliminar puesto de trabajo por ID (DELETE)
  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  // Buscar puestos de trabajo por lugar (GET /lugar/{lugar})
  buscarPorLugar(lugar: string): Observable<PuestoDeTrabajo[]> {
    return this.http.get<PuestoDeTrabajo[]>(`${this.url}/lugar/${lugar}`);
  }
}
