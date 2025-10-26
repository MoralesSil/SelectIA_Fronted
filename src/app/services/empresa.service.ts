import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Empresa } from '../models/empresa';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private url = `${base_url}/api/empresas`;

  constructor(private http: HttpClient) {}

  // Insertar empresa (POST)
  insertar(empresa: Empresa): Observable<any> {
    return this.http.post(this.url, empresa);
  }

  // Listar empresas (GET)
  listar(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(this.url);
  }

  // Buscar empresa por ID (GET)
  buscarPorId(id: number): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.url}/${id}`);
  }

  // Eliminar empresa por ID (DELETE)
  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
