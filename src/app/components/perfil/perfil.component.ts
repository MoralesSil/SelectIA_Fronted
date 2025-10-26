import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { VerofertaComponent } from '../oferta/veroferta/veroferta.component';
import { VisualizarComponent } from "./visualizar/visualizar.component";

@Component({
  selector: 'app-perfil',
  imports: [
    RouterOutlet,
    VisualizarComponent
],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  constructor(public route:ActivatedRoute){}
}
