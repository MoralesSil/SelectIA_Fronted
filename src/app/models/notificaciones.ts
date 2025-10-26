import { Usuario } from "./usuario";

export class Notificaciones {
  idNotificacion: number = 0;
  descripcion: string = '';
  tipo: number = 0;
  estado: number = 0;
  usuario: Usuario = new Usuario(); // Solo el id del usuario asociado
}
