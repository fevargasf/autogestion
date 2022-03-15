import { Component } from '@angular/core';
import { ExpedienteService } from 'src/app/core/services/expediente.service';

@Component({
  selector: 'app-spinner',
  template: `
   <div class="overlay" *ngIf="isLoading$ | async"> 
       <div class="lds-heart"><div></div></div> 
  </div>
  `,
  
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {

  isLoading$=this.spinnerSV.isLoading$;
  constructor(private spinnerSV:ExpedienteService) { }

}
