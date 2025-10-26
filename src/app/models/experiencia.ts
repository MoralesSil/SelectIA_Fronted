import { PerfilPostulante } from "./perfil-postulante";

export class Experiencia {
  idExperiencia: number = 0;
  empresa: string = '';
  puesto: string = '';
  fechaInicio: Date = new Date();
  fechaFin: Date = new Date();
  descripcion: string = '';
  perfilPostulante: PerfilPostulante = new PerfilPostulante(); // Solo el id del perfil
}
