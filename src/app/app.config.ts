import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

// import MyPreset from './mypreset';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
          options: {
            darkModeSelector: '.my-app-dark',
            prefix: 'p',
              cssLayer: {
                  name: 'primeng',
                  order: 'primeng, app-styles, another-css-library'
              }
          }
      }
  })
  ]
};