import {Component, EventEmitter, OnInit, Output,} from '@angular/core';
import {MatStepper} from '@angular/material/stepper';
import {ExpedienteService} from 'src/app/core/services/expediente.service';
import {ListaExpedienteArr} from 'src/app/pages/components/interfaces/lista_expediente-arr.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-datos-natural',
  templateUrl: './datos-natural.component.html',
  styleUrls: ['./datos-natural.component.scss'],
})
export class DatosNaturalComponent implements OnInit {
  @Output() atrasSegundoOut = new EventEmitter<boolean>();
  @Output() siguienteSegundoOut = new EventEmitter<boolean>();
  public listaExpedientes: ListaExpedienteArr[];
  public listaExpediente: ListaExpedienteArr;
  public fechaActual = new Date();
  public nombre = '';
  public email2 = '';
  public codigo = '';
  public tel = '';
  public cel = '';
  public dep = '';
  public mun = '';

  constructor(
    private stepper: MatStepper,
    private expediente: ExpedienteService
  ) {
  }

  ngOnInit(): void {
    this.getDataLocalStore();
  }

  public atrasSegundo(): void {
    this.atrasSegundoOut.emit(true);
  }

  public siguienteSegundo(): void {
    this.siguienteSegundoOut.emit(true);
    const expediente = JSON.parse(localStorage.getItem('expediente'));
    const sec = JSON.parse(localStorage.getItem('sec'));
    console.log(expediente);
    const dataRadicado = {
      // tslint:disable-next-line:radix
      expecter: parseInt(expediente.sequenceThirdParty2),
      // tslint:disable-next-line:radix
      sequence: parseInt(sec.sequenceThirdParty),
      rac: this.listaExpediente.ter_nombres,
      str: this.listaExpediente.ter_email,
      fijo: this.listaExpediente.ter_telefono,
      cel: this.listaExpediente.ter_celular,
    };

    this.expediente.obtenerRadicado(dataRadicado).subscribe((result) => {
      console.log('radicado', result.voRadicadoCoe);
      this.expediente.radicadoData(result.voRadicadoCoe);
      if (
        result.voRadicadoCoe === null ||
        result.doRadicado === null ||
        result.noSecDocCoe === null ||
        result.voRutaCoe === null
      ) {
        Swal.fire(`${result.voError}`, '', 'error');
      } else {
        // console.log('ok');
        this.stepper.next();
      }
    });
  }

  public getDataLocalStore(): void {
    const sec = JSON.parse(localStorage.getItem('sec'));
    const expediente = JSON.parse(localStorage.getItem('expediente'));
    // tslint:disable-next-line:radix
    const exp = expediente.sequenceThirdParty2;
    this.expediente.getListaExpedientes(sec.sequenceThirdParty2).subscribe((data) => {
      console.log(sec.sequenceThirdParty2)
      if (data.result) {
        this.listaExpedientes = data.lista_expedientes;
        this.listaExpedientes.filter((item) => {
          if (item.expediente === exp) {
            // console.log(item);
            this.listaExpediente = item;
            this.nombre = this.listaExpediente.ter_nombres;
            this.email2 = this.listaExpediente.ter_email;
            this.codigo = this.listaExpediente.asu_codigo;
            this.tel = this.listaExpediente.ter_telefono;
            this.cel = this.listaExpediente.ter_celular;
            this.dep = this.listaExpediente.ter_dir_depto;
            this.mun = this.listaExpediente.ter_dir_municipio;
          }
        });
      }
    });
  }
}
