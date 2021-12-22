import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExpedienteProcesoComponent} from './expediente-proceso.component';

describe('ExpedienteProcesoComponent', () => {
  let component: ExpedienteProcesoComponent;
  let fixture: ComponentFixture<ExpedienteProcesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpedienteProcesoComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpedienteProcesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
