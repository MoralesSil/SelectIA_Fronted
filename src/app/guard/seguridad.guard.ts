import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/login.service';
import { inject } from '@angular/core';

export const seguridadGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const lService = inject(LoginService);
  const router = inject(Router);
  
  const rpta = lService.verificar(); // Método que verifica si el usuario está autenticado
  
  if (!rpta) {
    router.navigate(['/login']); // Redirige al usuario a login si no está autenticado
    return false;
  }
  
  return rpta;
};
