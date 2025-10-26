import { Injectable } from '@angular/core';
import { JwtRequest } from '../models/jwtRequest';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario';
import { Observable } from 'rxjs';
const base_url = environment.base


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) {}
  private url2 = `${base_url}`;

  login(request: JwtRequest) {
    return this.http.post(`${this.url2}/login`, request);
  }
  verificar() {
    let token = sessionStorage.getItem('token');
    return token != null;
  }
  registrar(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.url2}/registrar`, usuario);
  }
  showRole() {
    let token = sessionStorage.getItem('token');
    if (!token) {
      // Manejar el caso en el que el token es nulo.
      return null; // O cualquier otro valor predeterminado dependiendo del contexto.
    }
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return decodedToken?.role;
  }
  showUsername() {
    let token = sessionStorage.getItem('token');
    if (!token) {
      // Manejar el caso en el que el token es nulo.
      return null; // O cualquier otro valor predeterminado dependiendo del contexto.
    }
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return decodedToken?.nombre ;
  }

  
}