import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ExpedienteService } from 'src/app/core/services/expediente.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public formulario: FormGroup;
  public loading = false;

  constructor(
    private fb: FormBuilder,
    private expedienteService: ExpedienteService,
    private router: Router,
    private cookieService: CookieService
  ) {

    if (this.cookieService.check('coraconn')) {
      const body = {
        coraconn: this.cookieService.get('coraconn'),
      };
      this.expedienteService.getCookie().subscribe((resp) => {
        this.cargarSecuencia(resp.noSecTercero);
      });
    }
  }

  ngOnInit(): void {
    this.formBuilderData();

  }

  public cargarSecuencia(sec): void {
    const secuencia = {
      sequenceThirdParty: sec.secuencia,
    };

    this.loading = true;
    this.expedienteService
      .getListaExpedientes(sec.secuencia)
      .subscribe((data) => {
        if (data.result) {
         // console.log(data);
          this.loading = false;
          this.guardarSec(secuencia);
          this.router.navigate(['/home']);
        } else {
          Swal.fire({
            title: `La secuencia ${sec.secuencia} no esta almacenada en los registros, por favor contacte con el area encargada.`,
            icon: 'error',
          });
          this.loading = false;
        }
      });
  }

  public formBuilderData(): void {
    this.formulario = this.fb.group({
      secuencia: ['', [Validators.required]],
    });
  }

  public guardarSec(data): void {
    localStorage.setItem('sec', JSON.stringify(data));
  //this.expedienteService.saveData('sec',data.sequenceThirdParty);

  // console.log(this.expedienteService.getData('sec'))
  }
}
