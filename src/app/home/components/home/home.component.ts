import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpedienteService } from 'src/app/core/services/expediente.service';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public nombreUsuario: string;
  public dialogRef: any;
  public sec: string;
  public isLoading = true;
  public horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  public verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  public loading = false;
  constructor(
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private expedienteService: ExpedienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
      // this.cargarDatosIniciales();
     this.getDataLocalStorage();
  }

  public getDataLocalStorage(): void {
    const sec = JSON.parse(localStorage.getItem('sec'));
    this.loading = true;

    this.expedienteService
      .getListaExpedientes(sec.sequenceThirdParty)
      .subscribe((datas) => {
        if (datas.result) {
          datas.lista_expedientes.map((value) => {
            this.nombreUsuario = value.ter_nombres;
            this.openSnackBar(this.nombreUsuario);
           

          });

        
          this.loading = false;
        } else {
          this.snackBar.dismiss();
              //Borrar variable cookie
      localStorage.removeItem('sec');
      //Redirigir a loguin en sirena
      window.location.href="https://sirena.corantioquia.gov.co/lago/CtrlIniciarApp?appCod=TRAMITE&urlRetorno=(https%3A%2F%2Fsirena.corantioquia.gov.co%2Fesirena%2FCtrlIndex)"
     
        }
      });
  }

  public siguientePrimero(estado: any): void {}

  public expedienteData(data: any): void {
    
  }

  public cerrarSession(): void {
    localStorage.removeItem('sec');
    localStorage.removeItem('radicadoR');
    localStorage.removeItem('responsable');
    localStorage.removeItem('responsable');
    localStorage.removeItem('expediente');
  }

  public openSnackBar(nombre): void {
    if (nombre !== '') {
      this.snackBar.open(`${nombre || 'Sin Nombre'}`, '', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
     
    }
    Swal.fire({
      title: '<strong>Política de Protección de Datos</strong>',
      width: 600,
      customClass: {
        container: 'swal2-container-position'
      },
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar',
      html:
        '<br>' +
        'Corantioquia está comprometida con el tratamiento leal, lícito, confidencial y seguro de sus datos personales. Por favor consulte nuestra Política de Tratamiento de datos personales en nuestra página web: ' +
        '<a target="_blank" href="https://www.corantioquia.gov.co/">corantioquia.gov.co</a> ' +
        ' en donde puede conocer sus derechos constitucionales y legales así como la forma de ejercerlos. Con mucho gusto atenderemos todas sus observaciones, consultas o reclamos en: <a  target="_blank" href="">protecciondedatos@corantioquia.gov.co</a>',
      showClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp',
      },
    });
  }

  ngOnDestroy(): void {
    this.snackBar.dismiss();
  }

  private cargarDatosIniciales() {
  /*   const cookie = { coraconn: this.cookieService.get('coraconn') };
    if (cookie.coraconn !== '') { */
    this.expedienteService.getCookie().subscribe((res) => {
      //Guardar variable Coockie
      const sec = { sequenceThirdParty: res.noSecTercero };
      localStorage.setItem('sec', JSON.stringify(sec));
      this.getDataLocalStorage();
    },err=>{
      //Borrar variable cookie
      //localStorage.removeItem('sec');
      //Redirigir a loguin en sirena
      //window.location.href="https://sirena.corantioquia.gov.co/lago/CtrlIniciarApp?appCod=TRAMITE&urlRetorno=(https%3A%2F%2Fsirena.corantioquia.gov.co%2Fesirena%2FCtrlIndex)"
      console.log("error",err)
    });
    }
}
