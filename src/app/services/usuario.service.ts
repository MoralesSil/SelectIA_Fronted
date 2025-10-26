import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const base_url = environment.base;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private url = `${base_url}/api/usuarios`;

  constructor(private http: HttpClient) {}

  // Listar todos los usuarios (GET)
  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url);
  }

  // Eliminar usuario por ID (DELETE)
  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  // Buscar usuario por ID (GET)
  buscarPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/${id}`);
  }

  actualizar(id: number, usuario: Usuario): Observable<any> {
  return this.http.put<Usuario>(`${this.url}/${id}`, usuario);
  }


  buscarPorUsername(username: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/username/${username}`);
  }


  // Buscar usuario por correo (GET /correo/{correo})
  buscarPorCorreo(correo: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/correo/${correo}`);
  }

  //Subir imagen
  subirImagen(id: number, imagen: File): Observable<{ imagenUrl: string }> {
    const formData = new FormData();
    formData.append('imagen', imagen);
    return this.http.post<{ imagenUrl: string }>(`${this.url}/${id}/subir-imagen`, formData);
  }
}
