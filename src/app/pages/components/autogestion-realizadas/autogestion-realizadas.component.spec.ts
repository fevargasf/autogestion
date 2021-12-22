import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AutogestionRealizadasComponent} from './autogestion-realizadas.component';

describe('AutogestionRealizadasComponent', () => {
  let component: AutogestionRealizadasComponent;
  let fixture: ComponentFixture<AutogestionRealizadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutogestionRealizadasComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutogestionRealizadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
