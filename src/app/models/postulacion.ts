import { OfertaLaboral } from "./oferta-laboral";
import { PerfilPostulante } from "./perfil-postulante";

export class Postulacion {
  idPostulacion: number = 0;
  fechaPostulacion: Date = new Date();
  perfilPostulante: PerfilPostulante = new PerfilPostulante(); // Solo el id del perfil postulante
  ofertaLaboral: OfertaLaboral = new OfertaLaboral();    // Solo el id de la oferta laboral
  estado: boolean = true;
}
