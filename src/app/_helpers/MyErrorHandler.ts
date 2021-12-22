import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, Injectable } from "@angular/core";
import { Notifier } from "../util/notifier";

@Injectable()
export class MyErrorHandler implements ErrorHandler{
    
    constructor(){}
    
    public handleError(error:any | HttpErrorResponse){
        if(error instanceof HttpErrorResponse){
            this.httpError(error);
        }else{
            console.error(error);
        }
    }

    httpError(error: HttpErrorResponse){
        switch(error.status){
            case 0:

            break;
            case 400:
                //error de formularios
                break;

            case 401://no tienes permisos o la sesion vencio
                //logout
                //redireccion
                break;

            default:
                console.error(error);
                Notifier.showNotification({message:'Lo sentimos, ha ocurrido un error',type:'error'});
                break;

        }
    }
}