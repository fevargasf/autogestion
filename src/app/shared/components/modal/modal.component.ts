import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ExpedienteService} from 'src/app/core/services/expediente.service';
import {ListaExpedienteArr} from 'src/app/pages/components/interfaces/lista_expediente-arr.interface';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  providers: []
})
export class ModalComponent implements OnInit {
  order: string = '';
  templist = [];
  displayedColumns = ['admite_autogestion','asu_codigo' ,'exp_estado','exp_sec','expediente','motivo_no_admite','nombre_asunto','respon_cargo','respon_correo','respon_nombre','respon_telefono_celu',
  'ter_celular','ter_dir_depto','ter_dir_municipio','ter_direccion','ter_documento','ter_email','ter_naturaleza','ter_nombres','ter_sec' ,'ter_telefono',
  'ter_tipo_documento','territorial', 'ultima_autogestion'];
  @Input() modalI: any;
  @Output() optenerExpedienteOut = new EventEmitter<any>();
  public sec: string;
  public listaExpedientes: ListaExpedienteArr[];
  public result: any;
  constructor(private modal: NgbModal, private expedienteService: ExpedienteService) {
  }

  ngOnInit(): void {
    this.getDataLocalStorage();
  }


  public closeModal(modal: any): void {
    this.modal.dismissAll();
  }

  public optenerExpediente(expediente: any): void {
    this.optenerExpedienteOut.emit(expediente);
  }

  public getDataLocalStorage(): void {
    const data = JSON.parse(localStorage.getItem('sec'));
    this.sec = data;
    this.expedienteService.getListaExpedientes(data.sequenceThirdParty).subscribe((datas) => {
      if (datas.result) {
        console.log(datas.result)
        this.listaExpedientes = datas.lista_expedientes;
        console.log(this.listaExpedientes)
        this.listaExpedientes = this.listaExpedientes.filter((item) => {
          return item.motivo_no_admite !== 'El expediente aun no tiene resolución que decide' && item.exp_estado !== 'Archivado';
        });

       // elemento: Element[] =this.listaExpedientes
      }
    });

  }
  
  sortByCol(nombre_asunto: string) {
    // if(this.order === '') {
    //   this.order += name;
    // } else if(this.order !=='' && this.order.includes(name)){
    //   console.log('alreday includes name');
    //   this.order.replace(name, '');
    // } else {
    //   console.log('in last else');
    //   this.order += name;
    // }

    if(this.templist.length > 0 ) {
      if(this.templist.indexOf(nombre_asunto) !== -1){
        console.log('alreday includes name');
        this.templist.pop();
      }else {
        console.log('not  includes name');
        this.templist.push(nombre_asunto);
      }
    } else {
      this.templist.push(nombre_asunto);
    }

    this.order = this.templist.join();
   // this.orderBy.transform(this.ELEMENT_DATA, this.order);
    console.log(nombre_asunto, this.order);
  }

}
export interface Element {
  admite_autogestion: string,
  asu_codigo:  string,
  exp_estado:  string,
  exp_sec:  string,
  expediente:  string,
  motivo_no_admite:  string,
  nombre_asunto:  string,
  respon_cargo:  string,
  respon_correo:  string,
  respon_nombre:  string,
  respon_telefono_celu:  string,
  ter_celular:  string,
  ter_dir_depto:  string,
  ter_dir_municipio:  string,
  ter_direccion:  string,
  ter_documento:  string,
  ter_email:  string,
  ter_naturaleza:  string,
  ter_nombres:  string,
  ter_sec: number,
  ter_telefono:  string,
  ter_tipo_documento:string,
  territorial: string,
  ultima_autogestion:string,
}