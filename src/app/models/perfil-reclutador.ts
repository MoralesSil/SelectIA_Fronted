import { Empresa } from "./empresa";
import { Usuario } from "./usuario";

export class PerfilReclutador {
  idReclutador: number = 0;
  usuario: Usuario = new Usuario();    // Solo el id del usuario
  empresa: Empresa = new Empresa();   // Solo el id de la empresa
}
