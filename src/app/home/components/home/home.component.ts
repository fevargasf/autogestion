import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpedienteService } from 'src/app/core/services/expediente.service';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import { finalize, find, switchMap, tap } from 'rxjs/operators';
import { from, Subject } from 'rxjs';
import { InstructivoComponent } from 'src/app/shared/components/instructivo/instructivo.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal!: InstructivoComponent;
  public nombreUsuario: string;
  public dialogRef: any;
  public sec: string;
  public horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  public verticalPosition: MatSnackBarVerticalPosition = 'top';
  public isLoading$ = Subject;
  public isDisabled: boolean = false;
  readonly BASE_URL = environment.urls;

  constructor(
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private expedienteService: ExpedienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
 //   this.cargarDatosIniciales();
  this.getDataLocalStorage();

  }
  openModal() {
    this.modal.openModal();
  }

  public getDataLocalStorage(): void {
    this.expedienteService.show();
    //home
   // this.router.navigate(['']);
  const sec = JSON.parse(localStorage.getItem('sec'));
  this.expedienteService
  .getListaExpedientes(sec.sequenceThirdParty)
  .pipe(
    tap((datas) => {
      if (!datas.result) {
        this.snackBar.dismiss();
        localStorage.removeItem('sec');
      }
    }),
    // Convertimos la lista de expedientes en un flujo observable
    switchMap((datas) => from(datas.result ? datas.lista_expedientes : [])),
    // Buscamos el primer expediente con un nombre no vacío
    find((value) => value.ter_nombres !== ''),
    tap((foundExpediente) => {
      if (foundExpediente) {
        this.nombreUsuario = foundExpediente.ter_nombres;
        this.isDisabled = false;
        this.snackBar.open(
          `${foundExpediente.ter_nombres || 'No tiene un usuario'}`,
          `🍃`,
          {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          }
        );
        this.expedienteService.hide();

        Swal.fire({
          padding:'19.3em',
          width: '56rem',
          background:'#fff url(assets/img/docs3.jpg)',
          allowOutsideClick: false,
          showCloseButton: true,
          showConfirmButton: false,
          customClass: {
            closeButton: 'custom-close-button' // Clase personalizada
          }
        })

      }else{

        this.isDisabled = true;
        Swal.fire({
          title:'Su usuario, no cuenta con expedientes.',
          icon:'warning',
          text:'No es posible continuar, sin datos',
          timer:2000
        })


      }
    })
  )
  .subscribe();
  }

  public cerrarSession(): void {

   let valida = this.expedienteService.redireccionesValidas(this.BASE_URL);

    if(valida){
    window.location.href = this.BASE_URL;
    this.delCookiePath();
   }

   document.cookie = 'coraconn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';
   localStorage.removeItem('expedienteActual');
    localStorage.removeItem('sec');
    localStorage.removeItem('radicadoR');
    localStorage.removeItem('responsable');
    localStorage.removeItem('arrayR');
    localStorage.removeItem('expediente');
    window.localStorage.removeItem("dataResponse");
    sessionStorage.removeItem('exA');
    sessionStorage.removeItem('expedientes.ts');
    window.localStorage.removeItem("RES");
    window.localStorage.removeItem("colum");
    let userCookie = 'coraconn'
    this.deleteCookie(userCookie);

  }


  ngOnDestroy(): void {
    this.snackBar.dismiss();
  }

  public politica(): void{
    Swal.fire({
      title: 'Lea atentamente, <strong>Política de Protección de Datos</strong>',
      width: 600,
      timer:2000,
      customClass: {
        container: 'swal2-container-position'
      },
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
  private cargarDatosIniciales() {
    this.expedienteService.getCookie().subscribe({
      next: (res) => {

        if (res && res.noSecTercero) {
          // Guardar variable Cookie
          const sec = { sequenceThirdParty: res.noSecTercero };
          localStorage.setItem('sec', JSON.stringify(sec));

          // Obtener datos del almacenamiento local
          this.getDataLocalStorage();

        } else {

          let userCookie = 'coraconn'
          this.deleteCookie(userCookie);
          this.delCookiePath();
          // Redirigir a login en caso de error
          this.redirigirALogin();
        }
      },
      error: (err) => {
        // Manejo de errores
        console.error("Error al obtener la cookie:", err);
        // Borrar variable cookie
        localStorage.removeItem('sec');
        let userCookie = 'coraconn'
        this.deleteCookie(userCookie);
        this.delCookiePath();
        // Redirigir a login en caso de error
        this.redirigirALogin();
      }/* ,
      complete: () => {

        this.redirigirALogin();
      } */
    });
  }
  private deleteCookie(cookieName) {
  this.expedienteService.delCookie().subscribe({
    next: (res) => {
    localStorage.clear();
    }
  })
    // Obtener la cookie actual
    if (document.cookie.includes(cookieName)) {
      // Eliminar la cookie con path y dominio si es necesario
      document.cookie = `${cookieName}=; Max-Age=0; path=/; domain=` + location.host;
      document.cookie = `${cookieName}=; Max-Age=0; path=/; domain=` + location.hostname;
      document.cookie = 'coraconn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';
    }
  }


  public delCookiePath(){
    this.expedienteService.delCookie().subscribe({
      next: (res) => {
        document.cookie = 'coraconn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';
        localStorage.clear();

      }
    })

  }

  private redirigirALogin() {
    let valida = this.expedienteService.redireccionesValidas(this.BASE_URL);

    if(valida){
    window.location.href = this.BASE_URL;
    this.delCookiePath();
   }
  }

}
