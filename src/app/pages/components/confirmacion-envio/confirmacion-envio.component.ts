import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ExpedienteService} from 'src/app/core/services/expediente.service';


@Component({
  selector: 'app-confirmacion-envio',
  templateUrl: './confirmacion-envio.component.html'
})
export class ConfirmacionEnvioComponent implements OnInit {
  public hola;
  public holas: any[] = [];
  public demoForm: FormGroup;
  public radicado: any;
  public files: any[];

  constructor(private formBuilder: FormBuilder, private expediente: ExpedienteService) {
    this.demoForm = this.formBuilder.group({
      photos: this.formBuilder.array([])
    });
  }

  ngOnInit(): void {

    this.expediente.radicadoObservable$.subscribe((data) => {
      this.radicado = data;
    });
  }


  createItem(data): FormGroup {
    return this.formBuilder.group(data);
  }


  get photos(): FormArray {
    return this.demoForm.get('photos') as FormArray;
  };

  public detectFiles(event): void {
    const files = event.target.files;
    if (files) {
      this.files = files;
      for (let file of files) {

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.photos.push(this.createItem({
            file,
            name: file.name,
            url: e.target.result
          }));
        }
        reader.readAsDataURL(file);
        //console.log(this.demoForm.value);
      }
    }
  }


  public eliminaArchivos(i): void {
   // console.log(i);
    // this.photos.removeAt(i);
    this.files.splice(i, 1);
  }


}



