import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import { AuthGuard } from './core/services/auth.guard';
import {LayoutComponent} from './layout/layout.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [      
           { path: '',redirectTo: '/auth/login',pathMatch: 'full'}, 
      {
        path: 'home',
        //canActivate: [AuthGuard],
        loadChildren: () => import('../app/home/home.module').then(m => m.HomeModule),
      },
      {
        path: 'inicio',
        canActivate: [AuthGuard],
        loadChildren: () => import('../app/pages/pages.module').then(m => m.PagesModule),
      },
      {
        path: 'inicio/:expediente/:tipoPersona',
        canActivate: [AuthGuard],
        loadChildren: () => import('../app/pages/pages.module').then(m => m.PagesModule),
      }
    ]
  },
  {
    path: 'auth',
    loadChildren: () => import('../app/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'not-found',
    component: PageNotFoundComponent
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/not-found'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true, preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
