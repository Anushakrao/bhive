// import { enableProdMode } from '@angular/core';
// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// import { AppModule } from './app/app.module';
// import { environment } from './environments/environment';
// import { initChartJS } from './libConfig/initChartJS';

// if (environment.properties.production) {
//   enableProdMode();
// }

// platformBrowserDynamic().bootstrapModule(AppModule).then(() => {
//   initChartJS();
// });


import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as firebase from 'firebase';
import { AppModule } from './app/app.module';
import { initChartJS } from './libConfig/initChartJS';
import { SystemService } from './app/service/system.service';
import { firebaseInitForServiceWorker } from './libConfig/firebaseInitForServiceWorker';

let bSystemService: SystemService = SystemService.getInstance();
if (environment.properties.production) {
  enableProdMode();
}

function bootstrapNow() {
  platformBrowserDynamic().bootstrapModule(AppModule).then((data) => {
    if (window['navigator'] && window['navigator']['splashscreen']) {
      //hide splash screen
      window['navigator']['splashscreen'].hide();
    }
    if(environment.properties.isNotificationEnabled){
      firebaseInitForServiceWorker();
    }
    initChartJS();
  });
}

if (bSystemService.deviceType == 'MOBILE') {
  document.addEventListener('deviceready', function () {
    bootstrapNow();
  });
} else {
  bootstrapNow();
}
