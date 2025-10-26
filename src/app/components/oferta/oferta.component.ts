import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { VerofertaComponent } from './veroferta/veroferta.component';

@Component({
  selector: 'app-oferta',
  imports: [
    RouterOutlet,
    VerofertaComponent
  ],
  templateUrl: './oferta.component.html',
  styleUrl: './oferta.component.css'
})
export class OfertaComponent {
  constructor(public route:ActivatedRoute){}
}
