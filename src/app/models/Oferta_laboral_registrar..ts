import { PerfilReclutador } from "./perfil-reclutador";
import { PuestoDeTrabajo } from "./puesto-de-trabajo";

export class Oferta_laboral_Registrar {
  idOferta?: number; 
  vacantes: number = 0;
  puestoDeTrabajo: PuestoDeTrabajo = new PuestoDeTrabajo();        // Solo el id del puesto de trabajo
  estado: boolean = true;
  fechaCreacion: Date = new Date();
  fechaCulminacion: Date = new Date();
  perfilReclutador: PerfilReclutador = new PerfilReclutador();       // Solo el id del perfil reclutador
}
