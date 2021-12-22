import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfirmacionEnvioComponent} from './confirmacion-envio.component';

describe('ConfirmacionEnvioComponent', () => {
  let component: ConfirmacionEnvioComponent;
  let fixture: ComponentFixture<ConfirmacionEnvioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmacionEnvioComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacionEnvioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
