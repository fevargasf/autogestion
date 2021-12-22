import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DatosJuridicosComponent} from './datos-juridicos.component';

describe('DatosJuridicosComponent', () => {
  let component: DatosJuridicosComponent;
  let fixture: ComponentFixture<DatosJuridicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatosJuridicosComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosJuridicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
