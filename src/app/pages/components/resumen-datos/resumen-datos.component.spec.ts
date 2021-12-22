import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ResumenDatosComponent} from './resumen-datos.component';

describe('ResumenDatosComponent', () => {
  let component: ResumenDatosComponent;
  let fixture: ComponentFixture<ResumenDatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResumenDatosComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
