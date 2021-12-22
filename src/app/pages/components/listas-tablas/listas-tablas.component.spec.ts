import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListasTablasComponent } from './listas-tablas.component';

describe('ListasTablasComponent', () => {
  let component: ListasTablasComponent;
  let fixture: ComponentFixture<ListasTablasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListasTablasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListasTablasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
