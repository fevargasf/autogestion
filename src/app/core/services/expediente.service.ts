import { HttpClient,HttpParams,HttpEvent,HttpProgressEvent, HttpEventType, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import { Injectable} from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';

/* INTERFACES */
import { BorrarObligacion } from 'src/app/pages/components/interfaces/borrar-obligacion.interface';
import { ConsultaObligacion } from 'src/app/pages/components/interfaces/consulta-obligacion.interface';
import { GuardarObligacionResponse } from 'src/app/pages/components/interfaces/guardar-obligacion-response';
import { ListaTabla } from 'src/app/pages/components/interfaces/lista-tabla';
import { ListaExpedientes } from 'src/app/pages/components/interfaces/lista_expedientes.interface';
import { ConsultaListaExpediente } from 'src/app/pages/components/interfaces/consulta-expediente.interface';
import { resolucionPrincipal } from 'src/app/pages/components/interfaces/resolucionprincipal';
import { ResultGuardarArchivo } from 'src/app/pages/components/interfaces/result-guardar-archivo.interface';
import { ResultGuardarObligacion } from 'src/app/pages/components/interfaces/result-guardar-obligacion.interface';

/* ENV */
import { environment } from 'src/environments/environment';

const API_EXPEDIENTE = environment.API_EXPEDIENTE;

@Injectable({
  providedIn: 'root',
})
export class ExpedienteService {
  private _refresh$                     = new Subject<void>();
  private traerListaExpedienteSubject   = new Subject<ListaExpedientes>();
  public  traerListaExpedienteObservable = this.traerListaExpedienteSubject.asObservable();

  // variables Observadoras
  private dataObligacionSubject$    = new Subject<any[]>();
  public  dataObligacionObservable$ = this.dataObligacionSubject$.asObservable();
  private dataArchivoSubject$       = new Subject<any[]>();
  public  dataArchivoObservable$    = this.dataArchivoSubject$.asObservable();
  private radicadoSubject$          = new Subject<any>();
  public  radicadoObservable$       = this.radicadoSubject$.asObservable();
  private firmaSubject$    =   new Subject<any>();
  public  firmaObservable$ =   this.firmaSubject$.asObservable();
  public banseraSubject$   =   new Subject<any>();
  public banderaObservable$=   this.banseraSubject$.asObservable();
  private userSource =         new BehaviorSubject<any>(undefined);
  private radFinal         =   new BehaviorSubject<any>(null);
  private firma            =   new BehaviorSubject<any>(null);
  private banderaSiguiente =   new BehaviorSubject<any>(null);
  isLoading$               =   new Subject<boolean>();
  readonly BASE_URL = environment.API_EXPEDIENTE;
  key = "123";

  constructor(private httpClient: HttpClient) { }



  show():void {
    this.isLoading$.next(true);
  }

  hide():void{
    this.isLoading$.next(false);
  }
  get refresh$(){
    return this._refresh$;
  }

  public redireccionesValidas(url:string):boolean{
    const allowedDomains = ['sirena.corantioquia.gov.co', 'pruebas.corantioquia.gov.co']; // Lista blanca de dominios
    try {
      const parsedUrl = new URL(url);
      return allowedDomains.some(domain => parsedUrl.hostname.endsWith(domain));
    } catch (e) {
      console.error('URL inválida:', e);
      return false;
    }
  }
  public getListaExpedientes(sequenceThirdParty: string): Observable<ListaExpedientes> {
    let params = new HttpParams().append('sequenceThirdParty',
      sequenceThirdParty
    );
    return this.httpClient.post<any>(
      `${this.BASE_URL}expedientes/lista-expedientes`,
      null,
      {
        params,
      }
    );
  }

  public getConsultaExpedientes_responsable(sequenceThirdParty: number, sequenceThirdParty2: number): Observable<ConsultaListaExpediente> {
    let params = new HttpParams()
    .append('sequenceThirdParty',
      String(sequenceThirdParty)
    ).append('sequenceThirdParty2',
      String(sequenceThirdParty2));

    return this.httpClient.post<ConsultaListaExpediente>(
      `${this.BASE_URL}consultaAuto/consultar-expedientes`,
      null,
      {
        params,
      }
    );
  }

  public firmaResponsable(formdata):Observable<any> {
    return this.httpClient.post<string[]>(
      `${this.BASE_URL}/firmar`,formdata ,{
        reportProgress: true,
        observe: 'events'
      }
    )

  }

  public postObtenerResolucion(value: string): Observable<any> {
    let params = new HttpParams().append('sequenceThirdParty2', value);
    return this.httpClient.post<any>(
      `${this.BASE_URL}resoluciones/lista-resoluciones`,
      null,
      {
        params,
      }
    );
  }
  public postGuardarObligacion(data): Observable<GuardarObligacionResponse> {
    return this.httpClient.post<GuardarObligacionResponse>(
      `${this.BASE_URL}obligations/guardar-obligacion`,
      data
    ).pipe(
      tap(() => {
        this._refresh$.next();
      })
    );
  }


  getFiles(): Observable<ListaTabla[]>{

    const sequenceThirdParty = JSON.parse(
      localStorage.getItem('sec')
    ).sequenceThirdParty;
    const sequenceThirdParty2 = JSON.parse(
      localStorage.getItem('expediente')
    ).sequenceThirdParty2;
    return this.httpClient.get<ListaTabla[]>( `${this.BASE_URL}listar-archivos/consultar-listarchivos?sequenceThirdParty2=${sequenceThirdParty2}&sequenceThirdParty=${sequenceThirdParty}`);
  }


  /* Observable<{ event: HttpEvent<any>, response?: string[] }>  */
  public postGuardarArchivo(formdata):Observable<{event:HttpEvent<any>,response?:any}> {

    return this.httpClient.post<string[]>(
      `${this.BASE_URL}listar-archivos/guardar-archivo`,formdata ,{
        reportProgress: true,
        observe: 'events'
      }
    ).pipe(
      tap(() => {
        this._refresh$.next();
      }),
      map((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.Response) {
          // Si el evento es una respuesta completa (HttpResponse)
          return { event, response: event.body };
        } else {
          // Para los demás eventos, solo devuelve el evento sin la respuesta
          return { event };
        }
      })
    );
  }
  public getCookie(): Observable<any> {
    //    return this.httpClient.post(`${this.BASE_URL}coraconn`, coraconn);
    const httpGetOptions = {
      withCredentials: true,
    };
    return this.httpClient.get(`${this.BASE_URL}coraconn`, httpGetOptions);
  }
  public delCookie(): Observable<object> {
    //    return this.httpClient.post(`${this.BASE_URL}coraconn`, coraconn);
    const httpGetOptions = {
      withCredentials: true,
    };
    return this.httpClient.get(`${this.BASE_URL}coraconn/delete-cookie`, httpGetOptions);
  }

  public delCookiePath(): Observable<object> {
    //    return this.httpClient.post(`${this.BASE_URL}coraconn`, coraconn);
    const httpGetOptions = {
      withCredentials: true,
    };
    return this.httpClient.get(`${this.BASE_URL}coraconn/delete-cookie-path`, httpGetOptions);
  }

  public getConsultarObligacion$(data: any): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}obligations/consultar-obligacion?sequenceThirdParty2=${data.sequenceThirdParty2}&sequenceThirdParty=${data.sequenceThirdParty}`
    ).pipe(
      tap(() => {
        this._refresh$.next();
      })
    )
  }
  public postEliminarObligacion(
    obligaLinea,
    sequenceThirdParty,
    sequenceThirdParty2
  ): Observable<any> {
    return this.httpClient.delete<string>(
      `${this.BASE_URL}obligations/borrar-obligacion`,
      {
        params: new HttpParams()
          .append('obligaLinea', obligaLinea)
          .append('sequenceThirdParty', sequenceThirdParty)
          .append('sequenceThirdParty2', sequenceThirdParty2),
      }
    )
  }

  public consultaArchivo(data: any): Observable<ListaTabla[]> {
    return this.httpClient.get<ListaTabla[]>(
      `${this.BASE_URL}listar-archivos/consultar-listarchivos?sequenceThirdParty2=${data.sequenceThirdParty2}&sequenceThirdParty=${data.sequenceThirdParty}`
    ).pipe(
      tap(() => {
        this._refresh$.next();
      })
    );
  }

  public obtenerRadicado(data): Observable<any> {
    return this.httpClient.post(`${this.BASE_URL}finish`, data);
  }

  public soporteRadicado(data): Observable<any> {
    return this.httpClient.post(`${this.BASE_URL}/evidencia`, data);
  }

  //data: RadicadoPdf
  public construirPdfRadicado(data: any) {
    return this.httpClient.post(
      `${this.BASE_URL}finish/construir-pdf-radicado`,
      data,
      { responseType: 'arraybuffer' }
    );
  }

/*se usa el merge */
  public consultaArchivoURL(data: any): Observable<any> {
    return this.httpClient.post(
      `${this.BASE_URL}listar-archivos/consulta-archivos`,
      data,
      { responseType: 'arraybuffer' }

    ).pipe(
      catchError((error: HttpErrorResponse) => {

        if (error.status === 404) {
          console.log('Error', 'No se encontraron archivos para esta consulta.', 'error');
        } else if (error.error instanceof ErrorEvent) {

          console.log('Error', `Error del cliente: ${error.error.message}`, 'error');
        } else {

          console.log('Error', `Error del servidor: ${error.message}`, 'error');
        }

        return throwError(() => new Error('Error al consultar archivos.'));
      })
    );
  }

    public validarCoordenadas84(niGradosLongitud,niMinsLongitud, niSegsLongitud, niGradosLatitud,niMinsLatitud,niSegsLatitud): Observable<any> {
    return this.httpClient.post(
      `${this.BASE_URL}validar/coordenada84?niGradosLongitud=${niGradosLongitud}&niMinsLongitud=${niMinsLongitud}&niSegsLongitud=${niSegsLongitud}&niGradosLatitud=${niGradosLatitud}&niMinsLatitud=${niMinsLatitud}&niSegsLatitud=${niSegsLatitud}`,
      {
        responseType: 'JSON'
      }).pipe(
        map((event: HttpEvent<any>) => {
          if (event.type === HttpEventType.Response) {
            // Si el evento es una respuesta completa (HttpResponse)
            return { event, response: event.body };
          } else {
            // Para los demás eventos, solo devuelve el evento sin la respuesta
            return { event };
          }
        })
    );
  }

  public validarCoorNac( niX,niY): Observable<any> {
    return this.httpClient.post(`${this.BASE_URL}validar/coordenada-nacional?niX=${niX}&niY=${niY}`,
      {
        responseType: 'JSON'
       }
    ).pipe(
        map((event: HttpEvent<any>) => {
          if (event.type === HttpEventType.Response) {
            // Si el evento es una respuesta completa (HttpResponse)
            return { event, response: event.body };
          } else {
            // Para los demás eventos, solo devuelve el evento sin la respuesta
            return { event };
          }
        })
    );
  }

  //data:Descarga RadicadoPdf
  public descargaPdf(data: any) {
    return this.httpClient.get(`${this.BASE_URL}finish/cloud-dowload`, data);
  }
  public guardarInformacionResponsable(data): Observable<any> {
    return this.httpClient.post(`${this.BASE_URL}save-PDF`, data);
  }

  public dataObligacion(data): void {
    this.dataObligacionSubject$.next(data);
  }

  public dataArchivo(data): void {
    this.dataArchivoSubject$.next(data);
  }

  public radicadoData(data): void {
    this.radicadoSubject$.next(data);
  }

  public firmaData(data): void {
   this.firmaSubject$.next(data);
  }

  public banderaData(data): void{
    this.banseraSubject$.next(data);
  }
    // Observable público para emitir el responsable
    currentUser$ = this.userSource.asObservable();
    passRad$ = this.radFinal.asObservable();
    banderaExpe$ = this.banderaSiguiente.asObservable();
    firma$ = this.firma.asObservable();

    // Método para actualizar el valor de 'user'
    changeUser(user: string) {
      this.userSource.next(user);
    }

    recopRad(radicado: any) {
      this.radFinal.next(radicado);
    }

    passFirma(firma:any){
      this.firma.next(firma);
    }

    bandera(banderaSiguiente:any){
      this.banderaSiguiente.next(banderaSiguiente);
    }


  public eliminarObligacion(
    niLinea,
    sequenceThirdParty,
    sequenceThirdParty2
  ): Observable<string> {
    return this.httpClient.delete<string>(
      `${this.BASE_URL}obligations/borrar-obligacion`,
      {
        params: new HttpParams()
          .append('obligaLinea', niLinea)
          .append('sequenceThirdParty', sequenceThirdParty)
          .append('sequenceThirdParty2', sequenceThirdParty2),
      }
    ).pipe(
      tap(() => {
        this._refresh$.next();
      })
    );
  }

  public eliminarArchivos(params: any) {
    return this.httpClient.delete(`${this.BASE_URL}listar-archivos/borrar-archivo`, {
        params
      }
    ).pipe(
      tap(() => {
        this._refresh$.next();
      })
    );
  }

  public eliminarZip(params: any) {
    return this.httpClient.delete(`${this.BASE_URL}listar-archivos/borrar-zip`, {
        params
      }
    ).pipe(
      tap(() => {
        this._refresh$.next();
      })
    );
  }

  public saveData(key: string, value: string) {
    localStorage.setItem(key, this.encrypt(value));
  }

  public getData(key: string) {
    const data = localStorage.getItem(key);
    return data ? this.decrypt(data) : null;
  }

  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
    let myCookie = 'coraconn'
    this.deleteCookie(myCookie)
  }

  private deleteCookie(cookieName) {
    // Obtener la cookie actual
    if (document.cookie.includes(cookieName)) {
      // Eliminar la cookie con path y dominio si es necesario
      document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  }


  private encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(txt, this.key).toString();
  }

  private decrypt(txtToDecrypt: any) {
    return CryptoJS.AES.decrypt(txtToDecrypt, this.key).toString(CryptoJS.enc.Utf8);
  }

  set(keys:any, value:any){
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,{
      keySize:128 / 8,
      iv:iv,
      mode:CryptoJS.mode.CBC,
      padding:CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }
  get(keys:any, value:any){
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);
    var decrypted = CryptoJS.AES.decrypt(value, key, {
      iv: iv,
      keySize:128 / 8,
      mode:CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);

  }

}



