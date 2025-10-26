import { PerfilPostulante } from "./perfil-postulante";

export class Educacion {
  idEducacion: number = 0;
  institucion: string = '';
  titulo: string = '';
  fechaInicio: Date = new Date();
  fechaFin: Date = new Date();
  estado: string = '';
  perfilPostulante: PerfilPostulante = new PerfilPostulante(); // Solo el id, para evitar ciclos o redundancias
}
