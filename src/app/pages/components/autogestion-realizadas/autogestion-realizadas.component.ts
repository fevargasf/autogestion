import {Component, OnInit} from '@angular/core';
import {ExpedienteService} from 'src/app/core/services/expediente.service';
import {ListaExpedienteArr} from 'src/app/pages/components/interfaces/lista_expediente-arr.interface';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageEvent} from '@angular/material/paginator';
const FILTER_PAG_REGEX = /[^0-9]/g;
@Component({
  selector: 'app-autogestion-realizadas',
  templateUrl: './autogestion-realizadas.component.html',
  styleUrls: ['./autogestion-realizadas.component.scss']
})


export class AutogestionRealizadasComponent implements OnInit {
  public estado: any;
  public sec: string;
  public fechaExpediente: any;
  public listaExpediente: ListaExpedienteArr[];
  public isLoading = true;
  page = 1;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 15];
  pageEvent: PageEvent;
 
  selectPage(page: string) {
    this.page = parseInt(page, this.listaExpediente.length) || 1;
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }
  public setPageSizeOptions(setPageSizeOptionsInput: string): void {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  constructor(
    private expedienteService: ExpedienteService,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    this.getdataLocalStorage();
    this.snackBar.dismiss();
  }

  public getdataLocalStorage(): void {
    const data = JSON.parse(localStorage.getItem('sec'));
    this.sec = data;
    console.log(this.sec);
    this.expedienteService.getListaExpedientes(data.sequenceThirdParty).subscribe((datas) => {
      if (datas.result) {
        this.listaExpediente = datas.lista_expedientes;
        this.listaExpediente.sort((a, b) => {
          if (a.admite_autogestion < b.admite_autogestion) {
            console.log(a.admite_autogestion, b.admite_autogestion);
            return 1;
          }
          if (a.admite_autogestion > b.admite_autogestion) {
            console.log(a.admite_autogestion, b.admite_autogestion);
            return -1;
          }
          // a must be equal to b
          return 0;
        });

        console.log(this.listaExpediente.length);
        this.isLoading = false;
      }
    });
  }

  public responsive(event): void {
    console.log(event.target.innerWidth);
  }


}
