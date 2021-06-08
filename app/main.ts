import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core'; // Uncomment for production
import { AppModule } from './app.module';




enableProdMode(); // uncomment in production


const platform = platformBrowserDynamic();

platform.bootstrapModule(AppModule);
