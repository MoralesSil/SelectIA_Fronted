import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Notificaciones } from '../models/notificaciones';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  private url = `${base_url}/api/notificaciones`;

  constructor(private http: HttpClient) {}

  // Insertar notificación (POST)
  insertar(notificacion: Notificaciones): Observable<any> {
    return this.http.post(this.url, notificacion);
  }

  // Listar todas las notificaciones (GET)
  listar(): Observable<Notificaciones[]> {
    return this.http.get<Notificaciones[]>(this.url);
  }

  // Buscar notificación por ID (GET)
  buscarPorId(id: number): Observable<Notificaciones> {
    return this.http.get<Notificaciones>(`${this.url}/${id}`);
  }

  // Eliminar notificación por ID (DELETE)
  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  // Buscar notificaciones por usuario ID (GET /usuario/{usuarioId})
  buscarPorUsuario(usuarioId: number): Observable<Notificaciones[]> {
    return this.http.get<Notificaciones[]>(`${this.url}/usuario/${usuarioId}`);
  }
}
