import { Component,OnInit,Output,EventEmitter,ViewChild,Input,} from '@angular/core';
import { ExpedienteService } from 'src/app/core/services/expediente.service';
import Swal from 'sweetalert2';
import { ListaExpedienteArr } from 'src/app/pages/components/interfaces/lista_expediente-arr.interface';

@Component({
  selector: 'app-document-radicado',
  templateUrl: './document-radicado.component.html',
  styleUrls: ['./document-radicado.component.scss'],
})
export class DocumentRadicadoComponent implements OnInit {
  @ViewChild('pdfViewer') pdfViewer;
  @Input() radicado:any;
  @Output() siguientePrimeroOut = new EventEmitter<any>();
  @ViewChild("stepper") stepper;
  public pdfUrl;
  public pdfHandler;
  public isLoading=false;
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
  public ter_dir_municipio:string;
  constructor(private expedienteService: ExpedienteService) {}

  ngOnInit(): void {
    console.log(this.radicado);
    this.construirPdfRadicado();
   
  }
  
  construirPdfRadicado() {
    const expediente = JSON.parse(localStorage.getItem('expediente'));
    const expedienteActual = JSON.parse(sessionStorage.getItem('expedienteActual'));
    const sec = JSON.parse(localStorage.getItem('sec'));
    const responsable = JSON.parse(localStorage.getItem('responsable'));
    
    const radicadoTest = {
      expedientDTO: {
        respon_nombre: responsable.nombre,
        respon_correo: responsable.correo,
        respon_cargo: responsable.cargo,
        respon_telefono_celu: responsable.telefonoCelular,
        ter_dir_municipio:expedienteActual.ter_dir_municipio,
        ter_nombres:expedienteActual.ter_nombres,
        ter_email:expedienteActual.ter_email,
        ter_celular:expedienteActual.ter_celular,
        expediente:expedienteActual.expediente
      },
      radicado: this.radicado.radicado,
      fechaRadicado:new Date(this.radicado.fechaRadicado).toLocaleDateString(),
      
      ruta: this.radicado.ruta,
      sequenceThirdParty: parseInt(sec.sequenceThirdParty),
      sequenceThirdParty2: parseInt(expediente.sequenceThirdParty2)
    };
    console.log(radicadoTest)
    
    this.expedienteService
      .construirPdfRadicado(radicadoTest)
      .subscribe(
        (result) => {
        let file = new Blob([result],{type:"application/pdf"});
        let blobUrl = URL.createObjectURL(file);

        this.pdfUrl = blobUrl;

      },error=>{
        Swal.fire({
          title: '<strong>Lo sentimos, no fue posible radicar tu Archivo</strong>',
          icon: 'info',
          html:
            'Ya enviamos una notificación a nuestros profesionales, ' ,
            
          showCloseButton: true,
          showCancelButton: true,
          focusConfirm: false,
          confirmButtonText:
            '<i class="fa fa-thumbs-up"></i> Entiendo',
          confirmButtonAriaLabel: 'Thumbs up, great!',
          cancelButtonText:
            '<i class="fa fa-thumbs-down"></i>',
          cancelButtonAriaLabel: 'Thumbs down'
        })
      }
      );
  }

  public siguientePrimero(): void {
    this.siguientePrimeroOut.emit(true);
    Swal.fire({
      title:
        '¿Está seguro que desea adjuntar esta información?, si acepta no podrá regresar a adjuntar obligaciones?',
      icon: 'question',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
    }).then((result) => {

    });
  }

  public siguienteQuito(estado: any): void {
    this.completo5 = estado;
    this.isEditable5 = !estado;
     this.stepper.next();
  }
 
}
