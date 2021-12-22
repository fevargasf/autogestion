import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectResolucionComponent } from './select-resolucion.component';

describe('SelectResolucionComponent', () => {
  let component: SelectResolucionComponent;
  let fixture: ComponentFixture<SelectResolucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectResolucionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectResolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
