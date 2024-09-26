import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'angular2-notifications';
import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
