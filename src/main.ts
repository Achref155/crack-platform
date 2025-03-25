import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Update appConfig to include provideAnimations
const updatedAppConfig = {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideAnimations()
  ]
};

bootstrapApplication(AppComponent, updatedAppConfig)
  .catch((err) => console.error(err));