import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ExpedienteService} from 'src/app/core/services/expediente.service';
import {ListaExpedienteArr} from 'src/app/pages/components/interfaces/lista_expediente-arr.interface';

@Component({
  selector: 'app-datos-juridicos',
  templateUrl: './datos-juridicos.component.html',
  styleUrls: ['./datos-juridicos.component.scss']
})
export class DatosJuridicosComponent implements OnInit {
  @Output() atrasSegundoOut = new EventEmitter<boolean>();
  @Output() siguienteSegundoOut = new EventEmitter<boolean>();
  public listaExpedientes: ListaExpedienteArr[];
  public listaExpediente: ListaExpedienteArr;
  public fechaActual = new Date();
  public lista = '';
  public nombre = '';
  public email2 = '';
  public codigo = '';
  public tel = '';
  public cel = '';
  public dep = '';
  public mun = '';

  constructor(
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
  }

  public getDataLocalStore(): void {
    const sec = JSON.parse(localStorage.getItem('sec'));
    const expediente = JSON.parse(localStorage.getItem('expediente'))
    // tslint:disable-next-line:radix
    const exp = expediente.sequenceThirdParty2;
    this.expediente.getListaExpedientes(sec.sequenceThirdParty2).subscribe((data) => {
      console.log(sec.sequenceThirdParty2);
      if (data.result) {
        this.listaExpedientes = data.lista_expedientes;
        this.listaExpedientes.filter((item) => {
          if (item.expediente === exp) {
            console.log(item.ter_nombres);
            console.log(item.asu_codigo);
            this.listaExpediente = item;

            this.nombre = this.listaExpediente.ter_nombres
            this.email2 = this.listaExpediente.ter_email
            this.codigo = this.listaExpediente.asu_codigo
            this.tel = this.listaExpediente.ter_telefono
            this.cel = this.listaExpediente.ter_celular
            this.dep = this.listaExpediente.ter_dir_depto
            this.mun = this.listaExpediente.ter_dir_municipio
          }
        });
      }
    });
  }

}
