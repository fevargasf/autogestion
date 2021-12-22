import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DatosNaturalComponent} from './datos-natural.component';

describe('DatosNaturalComponent', () => {
  let component: DatosNaturalComponent;
  let fixture: ComponentFixture<DatosNaturalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatosNaturalComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosNaturalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
