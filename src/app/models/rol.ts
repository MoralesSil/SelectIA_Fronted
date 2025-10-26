import { Usuario } from "./usuario";

export class Rol {
  idRol: number = 0;
  rol: string = '';
  usuario: Usuario = new Usuario(); // Puede ser null/undefined
}
