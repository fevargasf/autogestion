import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  ViewChild,
  Input,
} from '@angular/core';
import { ExpedienteService } from 'src/app/core/services/expediente.service';
import Swal from 'sweetalert2';
import { ListaExpedienteArr } from 'src/app/pages/components/interfaces/lista_expediente-arr.interface';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ConsultaListaExpediente } from '../interfaces/consulta-expediente.interface';
@Component({
  selector: 'app-document-radicado',
  templateUrl: './document-radicado.component.html',
  styleUrls: ['./document-radicado.component.scss'],
})
export class DocumentRadicadoComponent implements OnInit, OnDestroy {
  @ViewChild('pdfViewer') pdfViewer;
  @Output() siguientePrimeroOut = new EventEmitter<any>();
  @Output() onPrevtStep: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('stepper') stepper;
  suscription: Subscription;
  currentUserSubscription: Subscription;
  firmaSubscription: Subscription;
  public radicado: any;
  public pdfUrl;
  public pdfHandler;
  public isLoading = false;
  public completo5 = false;
  public isEditable5 = false;
  public atras = true;
  public siguiente = true;
  public radicadoR: string;
  public sec: string;
  public secuenciaTercero: string;
  public expediente: any;
  public listaExpediente: ListaExpedienteArr;
  public expe: string;
  public ter_dir_municipio: string;
  public imagenBase64: any;

  constructor(private expedienteService: ExpedienteService) {}

  ngOnInit(): void {
    this.currentUserSubscription = this.expedienteService.passRad$.subscribe(
      (rad) => {
        this.radicado = rad;
        if (rad) {
          this.firmaSubscription = this.expedienteService.firma$.subscribe(
            (f) => {
              this.imagenBase64 = f;
              if (f) {
                this.construirPdfRadicado();
              }
            }
          );
        }
      }
    );

    this.suscription = this.expedienteService.refresh$.subscribe(() => {
      this.construirPdfRadicado();
    });
  }

  async construirPdfRadicado() {
    const expediente = JSON.parse(localStorage.getItem('expediente'));
    const expedienteActual = JSON.parse(
      this.expedienteService.getData('expedienteActual')
    );
    const sec = JSON.parse(localStorage.getItem('sec'));
    const responsable = JSON.parse( this.expedienteService.getData('responsable') );
    const RES = JSON.parse(this.expedienteService.getData('RES'));
    const colum = JSON.parse(localStorage.getItem('colum'));
    const naturaleza =  localStorage.getItem('isTipoPersona');
    const totalResolucion = JSON.parse(
      this.expedienteService.getData('arrayR')
    );
    const coordenadasTotal = JSON.parse(
      sessionStorage.getItem('coordenadasTotal')
    );

    const radicadoTest = {
      expedientDTO: {
        respon_nombre: responsable.nombre,
        respon_correo: responsable.correo,
        respon_cargo: responsable.cargo,
        respon_telefono_celu: responsable.telefonoCelular,
        cc_responsable: this.imagenBase64?.cc_responsable,
        blifirma: this.imagenBase64?.blifirma,
        ter_dir_municipio: expedienteActual.ter_dir_municipio,
        ter_nombres: expedienteActual.ter_nombres,
        ter_email: expedienteActual.ter_email,
        ter_celular: expedienteActual.ter_telefono,
        expediente: expedienteActual.expediente,
        ter_naturaleza:naturaleza,
        radicado: RES.radicado,
        fecha_firmeza: expedienteActual.fecha_firmeza,
        coe_RADICADO: this.radicado?.radicado,
        nombre_asunto: expedienteActual.nombre_asunto,
        coordenada_x: RES.coordenada_x,
        coordenada_y: RES.coordenada_y,
        sistema_coordenadas: RES.sistema_coordenadas,
        descriptor: RES.descriptor,
        colum: colum,
        arrayR: totalResolucion,
        coordenadas: coordenadasTotal,
      },
      radicado: this.radicado?.radicado,
      fechaRadicado: this.radicado?.fechaRadicado,
      ruta: this.radicado?.ruta,
      sequenceThirdParty: parseInt(sec.sequenceThirdParty),
      sequenceThirdParty2: parseInt(expediente.sequenceThirdParty2),
    };

    await this.expedienteService.construirPdfRadicado(radicadoTest).subscribe(
      (result) => {
        let file = new Blob([result], { type: 'application/pdf' });
        let blobUrl = URL.createObjectURL(file);
        this.pdfUrl = blobUrl;

        if (this.pdfUrl !== null || this.pdfUrl !== undefined) {
          localStorage.setItem("firma", 'true');
          Swal.fire({
            title: '<strong>🎉 ¡Se ha enviado con éxito a nuestros registros!</strong>',
            icon: 'success',
            html: `
              <p>Tu radicado: <strong>${radicadoTest?.radicado}</strong></p>
              <p>Te recomendamos estar pendiente del correo electrónico registrado para podernos comunicar contigo.</p>
            `,
            confirmButtonText: "Aceptar",
            showCloseButton: false,
            showCancelButton: false,
            focusConfirm: false,
          });

        } else {
          localStorage.setItem("firma", 'true');
          Swal.fire({
            title: 'Error inesperado, si el error persiste ponte en contacto.',
            icon: 'error',
          });
          this.onPrevtStep.emit();
        }
      },
      (error) => {
        console.warn(error);
        if (error) {
          let personalError = radicadoTest?.radicado;
          localStorage.setItem("firma", 'true');
          this.onPrevtStep.emit();
          const datosError = {
            sequenceThirdParty2: parseInt(expediente.sequenceThirdParty2),
            mensajeError: personalError
              ? 'Visualización del documento, no disponible. Radicado del documento ' +
                personalError
              : 'Error al radicar, porfavor ponte en contacto.',
          };
          Swal.fire({
            title: ` ${datosError.mensajeError} `,
            icon: 'error',
          });

          this.expedienteService
            .soporteRadicado(datosError)
            .subscribe((result) => {
              this.onPrevtStep.emit();
            });
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
    this.currentUserSubscription.unsubscribe();
    this.firmaSubscription.unsubscribe();
  }

  public clearLocal() {
    window.sessionStorage.removeItem('expedienteActual');
    localStorage.removeItem('expedienteActual');
    localStorage.removeItem('sec');
    window.localStorage.removeItem('radicadoR');
    window.localStorage.removeItem('sec');
    window.localStorage.removeItem('responsable');
    document.cookie =
      'coraconn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' +
      window.location.hostname +
      ';';
    window.localStorage.removeItem('RES');
    window.localStorage.removeItem('colum');
    window.localStorage.removeItem('dataResponse');
    window.localStorage.removeItem('arrayR');
    let myCookie = 'coraconn';
    //this.deleteCookie(myCookie);
    //this.delCookiePath();
  }
  private deleteCookie(cookieName) {
    this.expedienteService.delCookie().subscribe({
      next: (res) => {
        document.cookie =
          'coraconn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' +
          window.location.hostname +
          ';';
        localStorage.clear();
      },
    });
    // Obtener la cookie actual
    if (document.cookie.includes(cookieName)) {
      document.cookie =
        'coraconn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' +
        window.location.hostname +
        ';';
      document.cookie =
        `${cookieName}=; Max-Age=0; path=/autogestion; domain=` + location.host;
      document.cookie =
        `${cookieName}=; Max-Age=0; path=/autogestion; domain=` +
        location.hostname;
    }
  }

  public delCookiePath() {
    this.expedienteService.delCookie().subscribe({
      next: (res) => {
        document.cookie =
          'coraconn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' +
          window.location.hostname +
          ';';
        localStorage.clear();
      },
    });
  }
}
