import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardsComponent } from './components/dashboards/dashboards.component';
import { OfertaComponent } from './components/oferta/oferta.component';
import { BusquedaComponent } from './components/busqueda/busqueda.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { BusquedadetalleComponent } from './components/busquedadetalle/busquedadetalle.component';
import { CreareditarofertaComponent } from './components/oferta/creareditaroferta/creareditaroferta.component';
import { VerofertaComponent } from './components/oferta/veroferta/veroferta.component';
import { CargarcvComponent } from './components/perfil/cargarcv/cargarcv.component';
import { HomeComponent } from './components/home/home.component';
import { seguridadGuard } from './guard/seguridad.guard';
import { CrearofertalaboralComponent } from './components/oferta/crearofertalaboral/crearofertalaboral.component';
import { VisualizarPostulanteComponent } from './components/postulante/visualizar-postulante/visualizar-postulante.component';
import { MispostulacionesComponent } from './components/mispostulaciones/mispostulaciones.component';

export const routes: Routes = 
[
    {
        path: '',
        redirectTo: 'landing',
        pathMatch: 'full',
    },
    {
        path: 'landing',
        component: LandingComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'dashboards/:id',
        component: DashboardsComponent,
        canActivate: [seguridadGuard],
    },
    {
        path: 'oferta',
        component: VerofertaComponent,
        canActivate: [seguridadGuard],
    },
    {
        path: 'crearoferta2',
        component: CrearofertalaboralComponent,
        canActivate: [seguridadGuard],
    },  
    {
        path: 'crearoferta',
        component: CreareditarofertaComponent,
        canActivate: [seguridadGuard]
    },
    {
        path: 'crearoferta/Ediciones/:id',
        component: CreareditarofertaComponent,
        canActivate: [seguridadGuard]
    },
    {
        path: 'busqueda',
        component: BusquedaComponent
    },
    {
        path: 'perfil',
        component: PerfilComponent,
         children:[
            {
                path:'Cargar',
                component:CargarcvComponent
            },
        ],
        canActivate: [seguridadGuard],
    },
    {
        path: 'busquedadetalle/:id',
        component: BusquedadetalleComponent
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [seguridadGuard],
    },
    {
    path: 'postulante/:id',
    component: VisualizarPostulanteComponent,
    canActivate: [seguridadGuard],
    },
    {
    path: 'mispostulaciones',
    component: MispostulacionesComponent,
    canActivate: [seguridadGuard],
    },
];
