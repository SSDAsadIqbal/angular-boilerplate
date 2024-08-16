import { Injectable } from '@angular/core';

interface ILanguage{
  code:string;
  name:string;
}
@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {

  public API_URL: string | undefined;   //SiteManager API
  public API_URL_ACCESS: string | undefined;   //AccesControl API
  public API_URL_EVENT: string | undefined;
  public API_URL_EXECUTOR: string | undefined;
  public API_URL_AD:string | undefined;
  public API_HUB_URL:string | undefined;
  public COM_EVENT_HUB_URL:string | undefined;
  public COM_EXECUTOR_HUB_URL:string | undefined;
  public COM_URL_AD_HUB:string | undefined;
  public languages: ILanguage[] | undefined;

  constructor() { }
}
