import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ExpedienteService } from 'src/app/core/services/expediente.service';
import { ListaExpedienteArr } from 'src/app/pages/components/interfaces/lista_expediente-arr.interface';
import { ListaExpedientes } from 'src/app/pages/components/interfaces/lista_expedientes.interface';
import Swal from 'sweetalert2';
import { InstructivoComponent } from '../../../shared/components/instructivo/instructivo.component';
import { environment } from 'src/environments/environment';
import { ConsultaListaExpediente } from '../interfaces/consulta-expediente.interface';
export const emailPattern: string =
  '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$';
@Component({
  selector: 'app-expedientes',
  templateUrl: './expedientes.component.html',
  styleUrls: ['./expedientes.component.scss'],
})
export class ExpedientesComponent implements OnInit {
  @ViewChild('modal') modal!: InstructivoComponent;
  @Output() expedienteDataOut = new EventEmitter<any>();
  @Output() alertcheckOut = new EventEmitter<any>();
  public isLoading = true;
  public siguiente = true;
  public expediente: string;
  public estado: string;
  public asunto: string;
  public asuntoNombre: string;
  public oficina: string;
  public isArchivado = false;
  public juridico: string;
  public natural: string;
  public sec: string;
  public isTipoPersona: string;
  public isNatural = false;
  public isJuridico = false;
  public cargoData = false;
  public listaExpediente: ListaExpedienteArr;
  public cargoExpediente = false;
  public ter_email: string;
  public ter_direccion: string;
  public formulario: FormGroup;
  public exp_sec: number;
  public recuperar_user: any;
  public user: string;
  public ter_nombres: string;
  public ter_telefono: any;
  readonly BASE_URL = environment.urls;
  public aprobadoFrom: boolean;
  public elaboracionEst: string;
  respon_cargo: string | undefined;
  respon_correo: string | undefined;
  respon_nombre: string | undefined;
  respon_telefono_celu: string | undefined;
  ter_celular: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private expedienteService: ExpedienteService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // this.recuperar_user =  JSON.parse(this.expedienteService.getData('responsable'));

    const data = this.expedienteService?.getData('responsable');

    if (data) {
      try {
        this.recuperar_user = JSON.parse(data);
        this.expedienteService.changeUser(this.recuperar_user.nombre);
      } catch (error) {
        console.error('Error al parsear el JSON:', error);
      }
    } else {
      console.warn("No hay datos disponibles en 'responsable'.");
      const sec = JSON.parse(localStorage.getItem('sec'));
      this.recuperar_user = {
        sequenceThirdParty2:"",
       sequenceThirdParty:sec,
       nombre: this.ter_nombres ,
       correo: this.ter_email ,
       telefonoCelular: String(this.ter_telefono  ),
       cargo: 'Persona Natural2',
      };
    }

    this.getDataForm();
    this.selectsDisabled();
    this.snackBar.dismiss();
    this.getDataLocalStorage();
  }

  openModal() {
    this.modal.openModal();
  }

  public getDataForm(): void {
    this.formulario = this.fb.group({
      expediente: ['', [Validators.required]],
      estado: [this.estado || '', [Validators.required]],
      asunto: [this.asuntoNombre, [Validators.required]],
      // territorial: ['', [Validators.required]],
      // comunicacion: [false, Validators.requiredTrue],
      ter_direccion: ['', [Validators.required]],
      ter_dir_municipio: ['', [Validators.required]],
      ter_nombres: ['', [Validators.required]],
      ter_telefono: ['', [Validators.required]],
      ter_email: ['', [Validators.required]],

      nombre_responsable: [
        this.respon_nombre ? this.recuperar_user?.nombre : '',
        [Validators.required, Validators.minLength(5)],
      ],
      email_responsable: [
        this.respon_correo ? this.recuperar_user?.correo : '',
        [Validators.required, Validators.pattern(emailPattern)],
      ],
      celular_responsable: [
        this.respon_telefono_celu ? this.recuperar_user?.telefonoCelular : '',
        [
          Validators.required
        ],
      ],
      cargo_responsable: [
        this.respon_cargo ? this.recuperar_user?.cargo : '',
        [Validators.required, Validators.minLength(5)],
      ],
    });
  }

  public expedientesData(data: any): void {
    this.expedienteDataOut.emit(data);
  }

  public obtenerExpediente(data): void {
    if (data === '') {
      this.selectsDisabled();
    } else {
      this.selectsDisabled();
      this.expediente = data;
      sessionStorage.setItem('expedientes.ts', this.expediente);
      let recuperarSelect = sessionStorage.getItem('expedientes.ts');
      this.expediente = data || recuperarSelect;
      this.getDataLocalStorage();
    }
  }

  public selectsDisabled(): void {
    this.formulario.controls.expediente.disable();
    this.formulario.controls.estado.disable();
    this.formulario.controls.asunto.disable();
    this.formulario.controls.ter_nombres.disable();
    this.formulario.controls.ter_telefono.disable();
    this.formulario.controls.ter_email.disable();
    this.formulario.controls.ter_direccion.disable();
    this.formulario.controls.ter_dir_municipio.disable();
  }

  public selectsEnabled(): void {
    this.formulario.controls.expediente.enable();
    this.formulario.controls.estado.enable();
    this.formulario.controls.asunto.enable();
    this.formulario.controls.ter_nombres.enable();
    this.formulario.controls.ter_telefono.enable();
    this.formulario.controls.ter_email.enable();
    this.formulario.controls.ter_direccion.enable();
    this.formulario.controls.ter_dir_municipio.enable();
  }

  public siguienteListaEx(expediente): void {

    const sec = JSON.parse(localStorage.getItem('sec'));
    const responsable = {
      sequenceThirdParty2: 0,
      sequenceThirdParty: +sec.sequenceThirdParty,
      nombre: this.formulario.value?.nombre_responsable,
      correo: this.formulario.value?.email_responsable,
      telefonoCelular: String(this.formulario.value?.celular_responsable),
      cargo: String(this.formulario.value?.cargo_responsable),
    };

    if (this.formulario.invalid && this.isTipoPersona !== 'N') {
      this.formulario.markAllAsTouched();
      return;
    }

    if (this.isTipoPersona === 'N') {
      this.router.navigate(['../../inicio', expediente, 'natural']);
      this.expedienteService.bandera({ bandera: true, tipo: 'natural' });
      this.expedienteService.banderaData({ bandera: true, tipo: 'natural' });
      this.expedienteService.saveData('responsable',JSON.stringify(responsable));
    } else if (this.isTipoPersona === 'J') {
      this.expedienteService.saveData('responsable',JSON.stringify(responsable));
      let recuperarSelect = sessionStorage.getItem('expedientes.ts');
      this.router.navigate(['../../inicio', expediente, 'juridico']);
      this.expedienteService.bandera({ bandera: true, tipo: 'juridico' });
      this.expedienteService.banderaData({ bandera: true, tipo: 'juridico' });
    }
  }

  public getDataLocalStorage(): void {
    const datas = JSON.parse(localStorage.getItem('sec'));
    this.sec = datas;
    this.expedienteService
      .getListaExpedientes(datas.sequenceThirdParty)
      .subscribe((datasp: ListaExpedientes) => {
        if (datasp.result) {
          this.cargoData = datasp.result;
          datasp.lista_expedientes.find((value) => {
            if (value.expediente === this.expediente) {
              this.asuntoNombre = value.nombre_asunto;
              localStorage.setItem("agno",value.agno_mes)
              this.expedienteService
                .getConsultaExpedientes_responsable(
                  value.ter_sec,
                  value.exp_sec
                )
                .subscribe((profesional: ConsultaListaExpediente) => {
                  if (profesional && profesional.result && profesional.consulta_lista_expedientes?.length > 0) {
                    profesional.consulta_lista_expedientes.map(
                      (valueConsulta) => {

                        localStorage.setItem(
                          'expediente',
                          String(value.exp_sec)
                        );

                        this.cargoExpediente = true;
                        this.listaExpediente = value;
                        this.ter_email     = valueConsulta.ter_email;
                        this.ter_direccion = valueConsulta.ter_direccion;
                        this.isTipoPersona = valueConsulta.ter_naturaleza;
                        this.estado =        valueConsulta.exp_estado;
                        this.asuntoNombre =   valueConsulta.nombre_asunto;

                        this.expedienteService.saveData(
                          'expedienteActual',
                          JSON.stringify(valueConsulta)
                        );

                        this.formulario.controls.cargo_responsable?.setValue(
                         valueConsulta.respon_cargo
                       );
                       this.formulario.controls.email_responsable?.setValue(
                         valueConsulta.respon_correo.replace(";","").trim()
                       );
                       this.formulario.controls.nombre_responsable?.setValue(
                         valueConsulta.respon_nombre
                       );

                        this.formulario.controls.celular_responsable?.setValue(
                         valueConsulta.respon_telefono_celu ? valueConsulta.respon_telefono_celu : (valueConsulta.ter_telefono ?? "")
                       );

                        if (this.isTipoPersona === 'N') {
                          this.isNatural = true;
                          localStorage.setItem('isTipoPersona',"N");
                          const sec = JSON.parse(localStorage.getItem('sec'));

                        } else if (this.isTipoPersona === 'J') {
                          localStorage.setItem('isTipoPersona',"J");
                          this.isJuridico = true;
                        }

                        if (this.listaExpediente.exp_estado === 'Archivado') {
                          this.isArchivado = true;
                          Swal.fire(
                            'El estado del expediente es archivado no se puede realizar autogestion',
                            '',
                            'error'
                          );
                        } else if (
                          this.listaExpediente.motivo_no_admite ===
                          'El expediente aun no tiene resolución que decide'
                        ) {
                          this.isArchivado = true;
                          Swal.fire(
                            'El expediente aun no tiene resolución que decide',
                            '',
                            'error'
                          );
                        } else {
                          this.isArchivado = false;
                        }
                      }
                    );
                  }
                });
            }
          });
        }
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

  public cerrarSession(): void {
    let valida = this.expedienteService.redireccionesValidas(this.BASE_URL);

    if (valida) {
      window.location.href = this.BASE_URL;
      this.delCookiePath();
    }
    // this.router.navigate(['  /not-found']);
    localStorage.removeItem('sec');
    localStorage.removeItem('radicadoR');
    localStorage.removeItem('responsable');
    localStorage.removeItem('arrayR');
    localStorage.removeItem('expediente');
    localStorage.removeItem('expedienteActual');
    document.cookie =
      'coraconn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' +
      window.location.hostname +
      ';';
    sessionStorage.removeItem('exA');
    sessionStorage.removeItem('expedientes.ts');
    window.localStorage.removeItem('RES');
    window.localStorage.removeItem('colum');
    window.localStorage.removeItem('dataResponse');
    let myCookie = 'coraconn';

    this.deleteCookie(myCookie);
  }

  private deleteCookie(cookieName) {
    this.expedienteService.delCookie().subscribe({
      next: (res) => {
        localStorage.clear();
      },
    });
    // Obtener la cookie actual
    if (document.cookie.includes(cookieName)) {
      document.cookie =
        `${cookieName}=; Max-Age=0; path=/; domain=` + location.host;
      document.cookie =
        `${cookieName}=; Max-Age=0; path=/; domain=` + location.hostname;
      document.cookie =
        'coraconn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' +
        window.location.hostname +
        ';';
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
