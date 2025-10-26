export class CandidatoRanking {
  idPerfil: number = 0;
  username: string = '';
  experienciaScore: number = 0;
  educacionScore: number = 0;
  habilidadesTecScore: number = 0;
  habilidadesBlandasScore: number = 0;
  certificacionesScore: number = 0;
  totalScore: number = 0;
  explicaciones: { [key: string]: string } = {}; 
}
