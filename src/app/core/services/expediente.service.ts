import { HttpClient,HttpHeaders,HttpParams, HttpRequest,HttpEvent,HttpProgressEvent, HttpEventType, HttpResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BorrarObligacion } from 'src/app/pages/components/interfaces/borrar-obligacion.interface';
import { ConsultaObligacion } from 'src/app/pages/components/interfaces/consulta-obligacion.interface';
import { GuardarObligacionResponse } from 'src/app/pages/components/interfaces/guardar-obligacion-response';
import { Upload } from 'src/app/pages/components/interfaces/upload';
import { ListaTabla } from 'src/app/pages/components/interfaces/lista-tabla';
import { ListaExpedientes } from 'src/app/pages/components/interfaces/lista_expedientes.interface';
import { RadicarPdf } from 'src/app/pages/components/interfaces/radicar-pdf.interface';
import { resolucionPrincipal } from 'src/app/pages/components/interfaces/resolucionprincipal';
import { ResultGuardarArchivo } from 'src/app/pages/components/interfaces/result-guardar-archivo.interface';
import { ResultGuardarObligacion } from 'src/app/pages/components/interfaces/result-guardar-obligacion.interface';
import { environment } from 'src/environments/environment';
function isHttpResponse<T>(event: HttpEvent<T>): event is HttpResponse<T> {
  return event.type === HttpEventType.Response
}

function isHttpProgressEvent(
  event: HttpEvent<unknown>
): event is HttpProgressEvent {
  return (
    event.type === HttpEventType.DownloadProgress ||
    event.type === HttpEventType.UploadProgress
  )
}

const API_EXPEDIENTE = environment.API_EXPEDIENTE;

@Injectable({
  providedIn: 'root',
})
export class ExpedienteService {
  private traerListaExpedienteSubject = new Subject<ListaExpedientes>();
  private listaExpediente$: Observable<ListaExpedientes>;
  private consultaResolucion$: Observable<resolucionPrincipal>;
  private guardarObligacion$: Observable<ResultGuardarObligacion>;
  private guardaArchivo$: Observable<ResultGuardarArchivo>;
  private consultaObligacion$: Observable<ConsultaObligacion>;
  private borrarObligacion$: Observable<BorrarObligacion>;
  public traerListaExpedienteObservable =
    this.traerListaExpedienteSubject.asObservable();
  // variables Observadoras
  private dataObligacionSubject$ = new Subject<any[]>();
  public dataObligacionObservable$ = this.dataObligacionSubject$.asObservable();
  private dataArchivoSubject$ = new Subject<any[]>();
  public dataArchivoObservable$ = this.dataArchivoSubject$.asObservable();
  private radicadoSubject$ = new Subject<any>();
  public radicadoObservable$ = this.radicadoSubject$.asObservable();
  readonly BASE_URL = environment.API_EXPEDIENTE;
  constructor(private httpClient: HttpClient) {}

  isLoading$=new Subject<boolean>();
  show():void {
    this.isLoading$.next(true);
  }

  hide():void{
    this.isLoading$.next(false);
  }


  public getListaExpedientes(
    sequenceThirdParty: string
  ): Observable<ListaExpedientes> {
    let params = new HttpParams().append(
      'sequenceThirdParty',
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
    )}
  public postGuardarArchivo(data): Observable<string> {
    return this.httpClient.post<string>(
      `${this.BASE_URL}listar-archivos/guardar-archivo`,
      data
    );
  }

  public getCookie(): Observable<any> {
    //    return this.httpClient.post(`${this.BASE_URL}coraconn`, coraconn);
    const httpGetOptions = {
      withCredentials: true,
    };
    return this.httpClient.get(`${this.BASE_URL}coraconn`, httpGetOptions);

  }
  public getConsultarObligacion$(data: any): Observable<any> {
    return this.httpClient.get(
      `${this.BASE_URL}obligations/consultar-obligacion?sequenceThirdParty2=${data.sequenceThirdParty2}&sequenceThirdParty=${data.sequenceThirdParty}`
    );
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
    );
  }

  public consultaArchivo(data: any): Observable<ListaTabla[]> {
    return this.httpClient.get<ListaTabla[]>(
      `${this.BASE_URL}listar-archivos/consultar-listarchivos?sequenceThirdParty2=${data.sequenceThirdParty2}&sequenceThirdParty=${data.sequenceThirdParty}`
    );
  }

  public consultaArchivoURL(data: any): string {
    return `${this.BASE_URL}listar-archivos/consulta-archivos?sequenceThirdParty2=${data.sequenceThirdParty2}&sequenceThirdParty=${data.sequenceThirdParty}`;
  }

  public consultaBlob(data: any): Observable<Upload>{
    const initialState: Upload = { state: 'PENDING', progress: 0 }
    const calculateState = (upload: Upload, event: HttpEvent<unknown>): Upload => {
      if (isHttpProgressEvent(event)) {
        return {
          progress: event.total
            ? Math.round((100 * event.loaded) / event.total)
            : upload.progress,
          state: 'IN_PROGRESS',
        }
      }
      if (isHttpResponse(event)) {
        return {
          progress: 100,
          state: 'DONE',
        }
      }
      return upload
    }
    return this.httpClient.get<Upload>(
      `${this.BASE_URL}listar-archivos/consulta-archivos?sequenceThirdParty2=${data.sequenceThirdParty2}&sequenceThirdParty=${data.sequenceThirdParty}`
      , data)
      .pipe(scan(calculateState, initialState))
    
  }

  public obtenerRadicado(data): Observable<any> {
    return this.httpClient.post(`${this.BASE_URL}finish`, data);
  }

  //data: RadicadoPdf
  public construirPdfRadicado(data: any) {
    return this.httpClient.post(
      `${this.BASE_URL}finish/construir-pdf-radicado`,
      data,
      { responseType: 'arraybuffer' }
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
    console.log('DESDE EL SERVICIO', data);
    this.dataObligacionSubject$.next(data);
  }

  public dataArchivo(data): void {
    console.log('DESDE EL SERVICIO', data);
    this.dataArchivoSubject$.next(data);
  }

  public radicadoData(data): void {
    this.radicadoSubject$.next(data);
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
    );
  }
  
  public eliminarArchivos(params: any) {
    return this.httpClient.delete(`${this.BASE_URL}listar-archivos/borrar-archivo`, {
        params
      }
    );
  }
}

function scan(calculateState: (upload: Upload, event: HttpEvent<unknown>) => Upload, initialState: Upload): import("rxjs").OperatorFunction<HttpEvent<Upload>, Upload> {
  throw new Error('Function not implemented.');
}

