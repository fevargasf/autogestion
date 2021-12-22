import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ExpedienteService} from 'src/app/core/services/expediente.service';
import {ListaExpedienteArr} from 'src/app/pages/components/interfaces/lista_expediente-arr.interface';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() modalI: any;
  @Output() optenerExpedienteOut = new EventEmitter<any>();
  public sec: string;
  public listaExpedientes: ListaExpedienteArr[];
  public result: any;
  selectedBook : any;
  myBooks = [
    { id : 1, tipo : "CONCESIÓN DE AGUAS SUPERFICIALES", author : "Leo Tolstoy" }, 
    { id : 2, tipo : "VERTIMIENTOS", author : "J. R. R. Tolkien" }, 
    
  ];
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
        this.listaExpedientes = datas.lista_expedientes;
        this.listaExpedientes = this.listaExpedientes.filter((item) => {
          return item.motivo_no_admite !== 'El expediente aun no tiene resolución que decide' && item.exp_estado !== 'Archivado';
        });
      }
    });
  }

}
