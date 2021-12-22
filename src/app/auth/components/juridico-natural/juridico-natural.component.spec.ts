import {ComponentFixture, TestBed} from '@angular/core/testing';

import {JuridicoNaturalComponent} from './juridico-natural.component';

describe('JuridicoNaturalComponent', () => {
  let component: JuridicoNaturalComponent;
  let fixture: ComponentFixture<JuridicoNaturalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JuridicoNaturalComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JuridicoNaturalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
