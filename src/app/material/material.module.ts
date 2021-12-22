import {NgModule} from '@angular/core';
import {MatStepperModule} from '@angular/material/stepper';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';

@NgModule({
  declarations: [],
  imports: [
    MatStepperModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatListModule
  ],
  exports: [
    MatStepperModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatListModule
  ]
})
export class MaterialModule {
}
