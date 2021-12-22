import {ErrorHandler, Injector, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LayoutComponent} from './layout/layout.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {SharedModule} from './shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { AuthGuard } from './core/services/auth.guard';
import { DocumentRadicadoComponent } from './pages/components/document/document-radicado.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MyErrorHandler } from './_helpers/MyErrorHandler';
import { NotifierModule } from 'angular-notifier';
import { Notifier } from './util/notifier';


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    PageNotFoundComponent,
   
   
  ],
  imports: [
    BrowserModule,
    NgxPaginationModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FontAwesomeModule,
    NotifierModule
  ],
  providers: [
    AuthGuard,
    {provide:ErrorHandler, useClass: MyErrorHandler},
    {provide:LocationStrategy, useClass:HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private injector:Injector){
    Notifier.injector = injector;
  }
}
