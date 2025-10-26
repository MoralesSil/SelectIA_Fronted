import { OfertaLaboral } from "./oferta-laboral";

export class VerPostulacion {
  idPostulacion: number = 0;
  fechaPostulacion: Date = new Date(); // Solo el id del perfil postulante
  ofertaLaboral: OfertaLaboral = new OfertaLaboral();    // Solo el id de la oferta laboral
  estado: boolean = true;
}
