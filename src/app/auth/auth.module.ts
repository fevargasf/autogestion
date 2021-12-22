import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuthRoutingModule} from './auth-routing.module';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {JuridicoNaturalComponent} from './components/juridico-natural/juridico-natural.component';
import {RepresentanteLegalComponent} from './components/representante-legal/representante-legal.component';
import {SharedModule} from '../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    JuridicoNaturalComponent,
    RepresentanteLegalComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AuthModule {
}
