import { Habilidad } from "./habilidad";
import { PerfilPostulante } from "./perfil-postulante";

export class HabilidadPostulante {
  id: number = 0;
  perfilPostulante: PerfilPostulante = new PerfilPostulante(); // Solo el id del perfil postulante
  nivel: string = '';
  habilidad: Habilidad = new Habilidad();        // Solo el id de la habilidad
}
