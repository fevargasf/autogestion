import {
  HttpEventType,
  HttpErrorResponse,
  HttpEvent,
} from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { map, tap, last, catchError } from 'rxjs/operators';
import { ExpedienteService } from 'src/app/core/services/expediente.service';
import { ConsultaListaExpediente } from 'src/app/pages/components/interfaces/consulta-expediente.interface';
import { ListaExpedientes } from 'src/app/pages/components/interfaces/lista_expedientes.interface';
import { UsuarioNatural, UsuarioRecuperado } from 'src/app/pages/components/interfaces/usuario-recuperado.interface';
import Swal from 'sweetalert2';

export const emailPattern: string =
  '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$';
@Component({
  selector: 'app-signature',
  templateUrl: './Signature.component.html',
  styleUrls: ['./Signature.component.css'],
})
export class SignatureComponent implements OnInit {
  @Input() text = 'Upload';
  @Output() complete = new EventEmitter<string>();
  @Output() onNextStep: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('fileUpload') fileUpload: ElementRef<HTMLInputElement>;
  fileInformation: any;
  isVisible: boolean;
  formulario: FormGroup;
  status: 'initial' | 'uploading' | 'success' | 'fail' = 'initial'; // Variable to store file status
  file: File | null = null; // Variable to store file
  imagenBase64: string;
  base64String: any;
  imagePreview: string | ArrayBuffer | null = null;
  pdfGeneratedSuccessfully: boolean = false;
  isUploading = false;
  progress: number;
  identifico: any;
  @Input() responsable: any;
  cargoData: boolean;
  recuperar_user: UsuarioRecuperado;
  exp_sec: number;
  ter_nombres: string;
  ter_email: string;
  ter_telefono: string;
  responsablePropio: UsuarioNatural;

  constructor(
    private fb: FormBuilder,
    private expediente: ExpedienteService,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    this.getDataForm();
    this.expediente.firmaObservable$.subscribe((data) => {
      this.imagenBase64 = data;
      if(data){
        localStorage.setItem("firma", 'false');
      }
    });

    this.expediente.banderaExpe$.subscribe((tipo)=>{
      this.identifico = tipo;
      if(tipo){
        this.getDataForm();
      }
    });
  }

  openModal() {
    this.isVisible = true;
  }

  closeModal() {
    this.isVisible = false;
    this.file = null;
    this.imagePreview = null;
    this.formulario.reset();
  }

  // On file Select
  onChange(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];
    event.target.value = '';
    if (file) {
      this.status = 'initial';
      this.file = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onUpload() {
    if (this.isUploading) {
      console.warn('La subida ya está en proceso...');
      return;
    }

    this.isUploading = false;

      const formData = new FormData();

      const expedienteActual = JSON.parse(localStorage.getItem('expediente'));
      const secuenciaTercero = JSON.parse(localStorage.getItem('sec'));

     if(this.formulario.get('nombre_responsable')?.value?.length === 0
    || this.formulario.get('email_responsable')?.value?.length === 0
    || this.formulario.get('celular_responsable')?.value?.length === 0
    || this.formulario.get('cc_responsable')?.value?.length === 0
    || this.file?.size === 0  || this.file?.size === null || this.file?.size === undefined
     ){

      Swal.fire({
        title:'Formulario sin terminar.',
        text:'Por favor, regrese al formulario y diligencie todos los campos',
        icon:'error',
        timer:4000
      })

     }else{
      this.isUploading = true;
      formData.append('file', this.file);
      formData.append(
        'sequenceThirdParty',
        secuenciaTercero.sequenceThirdParty
      );
      formData.append(
        'sequenceThirdParty2',
        expedienteActual.sequenceThirdParty2
      );
      formData.append(
        'nombre',
        this.formulario.get('nombre_responsable')?.value || ''
      );
      formData.append(
        'correo',
        this.formulario.get('email_responsable')?.value || ''
      );
      formData.append(
        'telefonoCelular',
        this.formulario.get('celular_responsable')?.value || ''
      );
      formData.append(
        'cedula',
        this.formulario.get('cc_responsable')?.value || ''
      );
      this.status = 'uploading';

      this.expediente
        .firmaResponsable(formData)
        .pipe(
          last(),
          catchError((error: HttpErrorResponse) => {
            return of(`${this.file?.name} upload failed.`);
          })
        )
        .subscribe({
          next: () => {
            this.status = 'success';
            Swal.fire(
              'Documento firmado',
              'Información guardada, exitosamente',
              'success'
            );
            this.obtenerFirma(
              expedienteActual.sequenceThirdParty2,
              secuenciaTercero.sequenceThirdParty
            );
            this.isUploading = false; // Resetear flag después de la ejecución
            this.closeModal();
          },
          error: (error: any) => {
            this.status = 'fail';
            localStorage.setItem("firma", 'true');
            Swal.fire('Faltan campos por diligenciar','Error en la subida del archivo','error')
            console.error('Error en la subida del archivo:', error);
            this.isUploading = false; // Resetear flag en caso de error
          },
        });
     }

  }

  obtenerFirma(sequenceThirdParty2: number, sequenceThirdParty: number) {
    this.expediente
      .getConsultaExpedientes_responsable(
        sequenceThirdParty,
        sequenceThirdParty2
      )
      .subscribe((respuesta: ConsultaListaExpediente) => {
        if (
          respuesta.result &&
          respuesta.consulta_lista_expedientes[0].blifirma
        ) {
         this.imagenBase64 = respuesta.consulta_lista_expedientes[0].blifirma;
          this.expediente.firmaData( respuesta.consulta_lista_expedientes[0].blifirma);
          this.expediente.passFirma(respuesta.consulta_lista_expedientes[0]);
          localStorage.setItem("firma", 'false');
          this.base64String = this.sanitizer.bypassSecurityTrustUrl( this.imagenBase64 );
        } else {
          Swal.fire({
            title: '<strong>Radicación, no permitida</strong>',
            icon: 'error',
            html: `
              <p>Importante: <strong>Esté expediente, no esta disponible para radicar.</strong></p>
              <p>Contactanos para más información.</p>
            `,
            showCloseButton: false,
            showCancelButton: false,  confirmButtonText: `
            Aceptar
          `,
            focusConfirm: false,
          });

          console.error('No se encontró la firma en la respuesta');

        }
      });
  }

  cancelFile() {
    this.file = null;
    this.imagePreview = null;
    this.status = 'initial';
  }

  public getDataForm(): void {
    this.formulario = this.fb.group({
      nombre_responsable: [this.identifico?.tipo === 'juridico'? this.responsable?.nombre : '', [Validators.required, Validators.minLength(5)]],
      email_responsable:  [this.identifico?.tipo === 'juridico' ? this.responsable?.correo : '', [Validators.required, Validators.pattern(emailPattern)]],
      celular_responsable:[this.identifico?.tipo === 'juridico' ? this.responsable?.telefonoCelular : '',[
          Validators.required,
          Validators.minLength(7),
          Validators.maxLength(10),
        ],
      ],
      cc_responsable: ['', [Validators.required,
        Validators.minLength(10),
        Validators.maxLength(15)]],
    });
  }
  isValidField(field: string): boolean | null {
    return (
      this.formulario.controls[field].errors &&
      this.formulario.controls[field].touched
    );
  }

  getFieldError(field: string): string | null {
    if (!this.formulario.controls[field]) return null;

    const errors = this.formulario.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracters.`;

        case 'pattern':
          return 'Correo no válido.';
      }
    }

    return null;
  }
}
