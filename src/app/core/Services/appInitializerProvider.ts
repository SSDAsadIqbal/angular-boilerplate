import { HttpClient } from "@angular/common/http";
import { APP_INITIALIZER, inject } from "@angular/core";
import { catchError, of, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { AppInitializerService } from "./appInitializerService.service";

export const appInitializerFactory = () => {  
  const appInitializerService = inject(AppInitializerService);
  const http = inject(HttpClient);
  return () =>
    new Promise((resolve) => {
      //let filePath:string = environment.production?'../../../assets/appsettings.prod.json':'../../../assets/appsettings.json';
      const filePath:string = appSettingsFilePath();
      http.get(filePath).pipe(tap((data: any) => {
        appInitializerService.API_URL = data.API_URL;
        appInitializerService.API_URL_ACCESS = data.API_URL_ACCESS;
        appInitializerService.API_URL_EVENT = data.API_URL_EVENT;
        appInitializerService.API_URL_EXECUTOR = data.API_URL_EXECUTOR;
        appInitializerService.API_URL_AD = data.API_URL_AD;
        appInitializerService.API_HUB_URL = data.API_HUB_URL;
        appInitializerService.COM_EVENT_HUB_URL = data.COM_EVENT_HUB_URL;
        appInitializerService.COM_EXECUTOR_HUB_URL = data.COM_EXECUTOR_HUB_URL;
        appInitializerService.COM_URL_AD_HUB = data.COM_URL_AD_HUB;
        appInitializerService.languages = data.languages;
        resolve(true);
      }),
      catchError(async (error) => {
        await defualtConfig(environment.production);
        resolve(true);
        return of(null);
      })).subscribe();
    });
};

let appSettingsFilePath = ():string => {
  if(environment.production && environment.azure){
    return '../../../assets/appsettings.azure.json';
  }else if(environment.production && !environment.azure){
    return '../../../assets/appsettings.prod.json';
  }else{
    return '../../../assets/appsettings.json';
  }
}

let defualtConfig = async (check:boolean):Promise<void> => {
  // const appInitializerService = inject(AppInitializerService);
  if (check) {
    // load settings for a deployed app
    // appInitializerService.API_URL = data.API_URL;
    // appInitializerService.API_URL_ACCESS = data.API_URL_ACCESS;
    // appInitializerService.comEventURL = data.comEventURL;
    // appInitializerService.comExecutorURL = data.comExecutorURL;
    // appInitializerService.languages = data.languages;
    //TODO
  } else {
    // load settings for a local app
    // appInitializerService.API_URL = data.API_URL;
    // appInitializerService.API_URL_ACCESS = data.API_URL_ACCESS;
    // appInitializerService.comEventURL = data.comEventURL;
    // appInitializerService.comExecutorURL = data.comExecutorURL;
    // appInitializerService.languages = data.languages;
    //TODO
  }
}
export const AppInitializerProvider = {  
  provide: APP_INITIALIZER,
  useFactory: appInitializerFactory,
  multi:true,
};