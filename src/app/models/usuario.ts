export class Usuario {
  idUsuario?: number; 
  username: string = '';
  nombres: string = '';
  apellidos: string = '';
  correo: string = '';
  estado: boolean = true;
  contraseña: string = '';
  enabled: boolean = true;
  fechaRegistro: Date = new Date();
  telefono: string = '';
  imagenUrl: string = '';
  tipodeDocuemnto: string = '';
  numeroDocumento: number = 0;
  fechadeNacimiento?: Date = new Date();
  distrito: string = '';
  departamento: string = '';
  pais: string = '';
  direccion: string = '';
  linkedin: string = '';
  redSocialPrincipal: string = '';
}
