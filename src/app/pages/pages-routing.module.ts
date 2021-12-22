import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AutogestionRealizadasComponent} from './components/autogestion-realizadas/autogestion-realizadas.component';
import {ExpedientesComponent} from './components/expedientes/expedientes.component';
import {InicioComponent} from './components/inicio/inicio.component';

const routes: Routes = [
  {
    path: '',
    component: InicioComponent
  },
  {
    path: 'autogestiones-realizadas',
    component: AutogestionRealizadasComponent
  },
  {
    path: 'lista-expedientes',
    component: ExpedientesComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {
}
