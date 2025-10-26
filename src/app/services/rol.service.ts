import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Rol } from '../models/rol';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private url = `${base_url}/api/roles`;

  constructor(private http: HttpClient) {}

  // Insertar rol (POST)
  insertar(rol: Rol): Observable<any> {
    return this.http.post(this.url, rol);
  }

  // Listar todos los roles (GET)
  listar(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.url);
  }

  // Eliminar rol por ID (DELETE)
  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  // Buscar rol por ID (GET)
  buscarPorId(id: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.url}/${id}`);
  }
}
