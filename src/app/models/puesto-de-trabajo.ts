import { Empresa } from "./empresa";

export class PuestoDeTrabajo {
  idPuesto: number = 0;
  titulo: string = '';
  pais: string = '';
  departamento: string = '';
  distrito: string = '';
  categoria: string = '';
  jornada: string = '';
  modalidad: string = '';
  salario: number = 0;
  descripcion: string = '';
  requisitos: string = '';
  empresa: Empresa = new Empresa();
  experiencia: string = '';
  educacion: string = '';
  habilidadesTecnicas: string = '';
  habilidadesBlandas: string = '';
  certificaciones: string = '';
  setEmbExperiencia: string = '[]';
  setEmbEducacion: string = '[]';
  setEmbHabTec: string = '[]';
  setEmbHabBlandas: string = '[]';
  setEmbCertificaciones: string = '[]';
}
