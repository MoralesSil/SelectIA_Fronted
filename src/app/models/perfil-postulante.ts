import { Usuario } from "./usuario";

export class PerfilPostulante {
  idPerfil: number = 0;
  usuario: Usuario = new Usuario();  // Solo el id del usuario asociado
  cvUrl: string = '';
  textoExtraido: string = '';
  educacion: string = '';
  experiencia: string = '';
  embeddingVector: string = '';
  habilidadesTecnicas: string = '';
  habilidadesBlandas: string = '';
  certificaciones: string = '';
  setEmbEducacion: string = '';
  setEmbExperiencia: string = '';
  setEmbHabTec: string = '';
  setEmbHabBlandas: string = '';
  setcertificaciones: string = '';
}
