
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AppInitializerService } from './appInitializerService.service';
import { Injectable } from '@angular/core';

interface RequestConfig {

  headers?: HttpHeaders;
  observe?: 'body';
  params?: HttpParams;
  reportProgress?: boolean;
  withCredentials?: boolean;
  responseType?: 'json';

}


@Injectable({
  providedIn:'any'
})
export class BaseHTTPService {

  public apiUrl = '';
  public apiUrl9801 = '';
  public apiUrl9805 = '';
  public apiUrl9804 = '';
  public apiUrl9807 = '';
  public config: RequestConfig;

  constructor(protected http: HttpClient, private activatedRoute: ActivatedRoute, private appInitializerService:AppInitializerService) {
    this.apiUrl = appInitializerService.API_URL!;
    this.apiUrl9801 = appInitializerService.API_URL_ACCESS!;
    this.apiUrl9807 = appInitializerService.API_URL_AD!;
    this.apiUrl9805 = this._replaceLastOccurance(appInitializerService.API_URL_EVENT!);
    this.apiUrl9804 = this._replaceLastOccurance(appInitializerService.API_URL_EXECUTOR!);
    this.config = {
      // headers: new HttpHeaders(),
      params: new HttpParams()
    };
  }

  private appendParams(params: any) {
    this.config.params = new HttpParams();
    // for (let [key, value] of Object.entries(params))  {
    //   console.log(params[key]);
    // }
    // Object.keys(params).forEach((key) => {
    //   this.config.params = this.config.params!.append(key, params);
    // });
    Object.keys(params).forEach((key) => {
      this.config.params = this.config.params!.append(key, params[key]);
    });
  }

  // GET
  public genericGetQuery<T>(routeURL: any, params?: any, apiName:string = ''): Observable<T> {
    return this.__get<T>(routeURL, params, apiName);
  }
  private __get<T>(url: any, params?: any, apiName?:string): Observable<T> {
    let apiUrl = this._apiUrlExtract(apiName!);
    if (params) {
      this.appendParams(params);
    }
    if(params == null){
      return this.http.get<T>(`${apiUrl}/${url}`).pipe(catchError((error) => this.errorHandler(error)));
    }else{
      return this.http.get<T>(`${apiUrl}/${url}`, this.config).pipe(catchError((error) => this.errorHandler(error))); 
    }
  }
  //===============================================================

  // POST
  public genericPostQuery<T>(routeURL: any, params: any, apiName:string = ''): Observable<T> {
    return this.__post<T>(routeURL, params, apiName);
  }
  private __post<T>(url: any, params: any, apiName?:string): Observable<T> {
    this.appendParams(params);
    let apiUrl = this._apiUrlExtract(apiName!);
    return this.http.post<T>(`${apiUrl}/${url}`, params).pipe(catchError(err => this.errorHandler(err)));
  }
  //===============================================================

  // PUT
  public genericPutQuery<T>(routeURL: any, params: any, apiName:string = ''): Observable<T> {
    return this.__put<T>(routeURL, params, apiName);
  }
  private __put<T>(url: any, params: any,  apiName?:string): Observable<T> {
    this.appendParams(params);
    let apiUrl = this._apiUrlExtract(apiName!);
    return this.http.put<T>(`${apiUrl}/${url}`, params).pipe(catchError(err => this.errorHandler(err)));
  }
  //===============================================================

  // DELETE
  public genericDeleteQuery<T>(routeURL: any, params: any, apiName:string = ''): Observable<T> {
    return this.__delete<T>(`${routeURL}`, params, apiName);
  }
  private __delete<T>(url: any, params: any, apiName?:string): Observable<T> {
    this.appendParams(params);
    let apiUrl = this._apiUrlExtract(apiName!);
    return this.http.delete<T>(`${apiUrl}/${url}`, {body:params}).pipe(catchError(err => this.errorHandler(err)));
  }
  //===============================================================

  // ERROR
  private errorHandler(error: any) {
    let errorMeassage = '';
    if (error.error instanceof ErrorEvent) {
      // get client side error
      errorMeassage = error.error.errorMeassage;
    }
    else if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
          // your logic here // 408 Request Timeout
          errorMeassage = "Unable to connect the server, please try again later."
          break;
        case 400:
          errorMeassage = this._errorMessageText(error,'400 Bad Request response.');
          break;
        case 401:
          // your logic here // 401 Unauthorized
          errorMeassage = "401 Unauthorized User."
          break;
        case 403:
          // your logic here // 403 Forbidden
          errorMeassage = "403 Forbidden\nUser not allowed for that action."
          break;
        case 404:
          // your logic here // 404 Not Found
          errorMeassage = this._errorMessageText(error,'404 Not Found.');
          break;
        case 408:
          // your logic here // 408 Request Timeout
          errorMeassage = "Request time out, please try again."
          break;
         case 500:
          // your logic here // 408 Request Timeout
          errorMeassage = this._errorMessageText(error,'500 Internal Server Error.');
          break; 
        default:
          errorMeassage = "Something bad happened, please try again later."
          break;
      }
    }
    else {
      switch (error.status) {
        case 500:
          errorMeassage = "500 Internal Server Error"
          break;
        case 501:
          // your logic here // 401 Unauthorized
          errorMeassage = "501 Rrequest can not be handled because it is not supported by the server"
          break;
        case 502:
          // your logic here // 403 Forbidden
          errorMeassage = "502 Bad Gateway"
          break;
        case 503:
          // your logic here // 404 Not Found
          errorMeassage = "503 Service Unavailable\nThe server is currently not ready to handle the request"
          break;
        case 504:
          // your logic here // 408 Request Timeout
          errorMeassage = "504 Request time out, please try again."
          break;
        case 511:
          // your logic here // 408 Request Timeout
          errorMeassage = "511 Network Authentication Required\nThe user needs to authenticate to gain network access."
          break;
        default:
          errorMeassage = "Something bad happened, please try again later."
          break;
      }
    }

    // if (environment.production === false) {
    //   // const errorJson = error.json();
    //   // console.log(errorJson);
    // }
    return throwError(() => new Error(errorMeassage));
  }
  //===============================================================

  // replace last / from url
  private _replaceLastOccurance(url:string):string{
      const str = url;
      const lastIndex = str.lastIndexOf('/');
      const replacement = '';
      const replaced = str.slice(0, lastIndex) + replacement + str.slice(lastIndex + 1);
          return replaced;
  }

  private _apiUrlExtract = (apiName:string):string => {
    switch (apiName) {
      case '9801':
        return this.apiUrl9801;
      case '9804':
        return this.apiUrl9804;
      case '9805':
        return this.apiUrl9805;
        case '9807':
        return this.apiUrl9807;
      default:
        return this.apiUrl;
    }
  }

  private _errorMessageText(error:any,text:string):string{
    let errorMeassage = '';
    if(error && error.error && error.error.errorResponse && typeof error.error.errorResponse == 'string'){
      errorMeassage = error.error.errorResponse;
    }else if(error && error.error && error.error.message && typeof error.error.message == 'string'){
      errorMeassage = error.error.message;   
    }else if(error && error.error && error.error.errorResponse && error.error.errorResponse.message && typeof error.error.errorResponse.message == 'string'){
      errorMeassage = error.error.errorResponse.message; 
    }else if(error && error.message && typeof error.message == 'string'){
      errorMeassage = error.message;
    }else if(error.error.errorResponse.validationErrors && error.error.errorResponse.validationErrors.length > 0){
      errorMeassage = error.error.errorResponse.validationErrors[0].reason;
    }else{
      errorMeassage = text;
    }
    return errorMeassage;
  }
}