import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { environment } from '../environments/environment';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { JwtModule } from '@auth0/angular-jwt';
import { initializeApp } from 'firebase/app';
import { provideFirebaseApp, initializeApp as initializeApp_alias } from '@angular/fire/app';
export function tokenGetter() {
  return sessionStorage.getItem('token');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withInterceptorsFromDi()), 
    provideHttpClient(withFetch()), 
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          //allowedDomains: ['localhost:8080'],
          //disallowedRoutes: ['localhost:8080/login/forget'],
          allowedDomains: ['selectia-backend.onrender.com'],
          disallowedRoutes: ['selectia-backend.onrender.com/login/forget'],
          //allowedDomains: ['donfy.onrender.com'],
          //disallowedRoutes: ['donfy.onrender.com/login/forget'],
        },
      })
    ),
provideFirebaseApp(() => initializeApp({ projectId: "esyslatinproducts", appId: "1:451206845972:web:10ff7774a7b949d4deb901", databaseURL: "https://esyslatinproducts-default-rtdb.firebaseio.com", storageBucket: "esyslatinproducts.appspot.com", apiKey: "AIzaSyCNeB9n32rVa2_h8djivB3t1lNfhuP4XS4", authDomain: "esyslatinproducts.firebaseapp.com", messagingSenderId: "451206845972" })), provideStorage(() => getStorage()),
],
};
