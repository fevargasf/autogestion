import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable} from "rxjs";
import { ExpedienteService } from "../core/services/expediente.service";
import {finalize} from "rxjs/operators";

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor{
    constructor(private spinnerSV:ExpedienteService){}
    intercept(req:HttpRequest<any>,next:HttpHandler): Observable<HttpEvent<any>>{
        this.spinnerSV.show();
        return next.handle(req).pipe(
            finalize(()=> this.spinnerSV.hide()
            ))

    }
}