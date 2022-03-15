import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ExpedienteService } from 'src/app/core/services/expediente.service';
import { ListaExpedienteArr } from 'src/app/pages/components/interfaces/lista_expediente-arr.interface';
import { ListaExpedientes } from 'src/app/pages/components/interfaces/lista_expedientes.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-expedientes',
  templateUrl: './expedientes.component.html',
  styleUrls: ['./expedientes.component.scss'],
  
})

export class ExpedientesComponent implements OnInit {
  //@Input() formulario: FormGroup;
  @Output() expedienteDataOut = new EventEmitter<any>();
  @Output() alertcheckOut = new EventEmitter<any>();
  public isLoading = true;
  public siguiente = true;
  public expediente: string;
  public estado: string;
  public asunto: string;
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
  public user:string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private expedienteService: ExpedienteService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.recuperar_user= JSON.parse(localStorage.getItem('responsable')); 
    this.getDataForm();
    this.selectsDisabled();
    this.snackBar.dismiss();
    this.getDataLocalStorage();
  }

  public getDataForm(): void {
    this.formulario = this.fb.group({
      expediente: new FormControl('', Validators.required),
      estado: new FormControl('', Validators.required),
      asunto: new FormControl('', Validators.required),
      territorial: new FormControl('', Validators.required),
      comunicacion: new FormControl(false, Validators.requiredTrue),
      ter_direccion: new FormControl('', Validators.required),
      ter_dir_municipio: new FormControl('', Validators.required),
      fijo_responsable: new FormControl(""),
      ter_nombres: new FormControl("", Validators.required),
      ter_telefono: new FormControl("", Validators.required),
      ter_email: new FormControl("", Validators.required),
      nombre_responsable: new FormControl(this.recuperar_user?this.recuperar_user.nombre:''),
      email_responsable: new FormControl(this.recuperar_user?this.recuperar_user.correo:''),
      celular_responsable: new FormControl(this.recuperar_user?this.recuperar_user.telefonoCelular:''),
      cargo_responsable: new FormControl(this.recuperar_user?this.recuperar_user.cargo:''),
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
      this.getDataLocalStorage();
    }
  }

  public selectsDisabled(): void {
    this.formulario.controls.expediente.disable();
    this.formulario.controls.estado.disable();
    this.formulario.controls.asunto.disable();
    this.formulario.controls.territorial.disable();
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
    this.formulario.controls.territorial.enable();
    this.formulario.controls.ter_nombres.enable();
    this.formulario.controls.ter_telefono.enable();
    this.formulario.controls.ter_email.enable();
    this.formulario.controls.ter_direccion.enable();
    this.formulario.controls.ter_dir_municipio.enable();
  }

  public siguienteListaEx(expediente): void {
    const sec = JSON.parse(localStorage.getItem('sec'));
    const responsable = {
      sequenceThirdParty2: '',
      sequenceThirdParty: +sec.sequenceThirdParty,
      nombre: this.formulario.value.nombre_responsable,
      correo: this.formulario.value.email_responsable,
      telefonoCelular: String(this.formulario.value.celular_responsable),
      cargo: String(this.formulario.value.cargo_responsable),
    };

    localStorage.setItem('responsable', JSON.stringify(responsable));
  

    if (responsable !== null && this.isTipoPersona !== 'N') {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Datos guardados!',
        showConfirmButton: false,
        timer: 1500,
      });
    }
    if (this.isTipoPersona === 'N') {
      this.router.navigate(['../../inicio', expediente, 'natural']);
    } else if (this.isTipoPersona === 'J') {
      this.router.navigate(['../../inicio', expediente, 'juridico']);
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
          datasp.lista_expedientes.filter((value) => {
            // tslint:disable-next-line:radix

            if (value.expediente === this.expediente) {
              sessionStorage.setItem(
                'expedienteActual',
                JSON.stringify(value)
              );

              this.cargoExpediente = true;
              this.listaExpediente = value;
              this.ter_email = value.ter_email;
              this.ter_direccion = value.ter_direccion;
              this.isTipoPersona = value.ter_naturaleza;

              if (this.isTipoPersona === 'N') {
                this.isNatural = true;
              } else if (this.isTipoPersona === 'J') {
                this.isJuridico = true;
                this.formulario.controls.nombre_responsable.setValidators(
                 Validators.nullValidator 
                );
                this.formulario.controls.email_responsable.setValidators(
                 Validators.nullValidator 
                );
                this.formulario.controls.celular_responsable.setValidators(
                 Validators.nullValidator 
                );
                this.formulario.controls.cargo_responsable.setValidators(Validators.nullValidator );
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
          });
        }
      });
  }

  public alertcheck(event): void {
    this.alertcheckOut.emit(true);
    Swal.fire({
      title: '<strong> <u>Estimado Usuario :</u></strong>',
      icon: 'info',
      html:
        'Los correos electrónicos de contacto que nos facilito son :<b> ' +
        this.ter_email +
        ' </b> ' +
        '<br>',

      showCloseButton: true,
      confirmButtonColor: '#3085d6',
    });
  }
}
