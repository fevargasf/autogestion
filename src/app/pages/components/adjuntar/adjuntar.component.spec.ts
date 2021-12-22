import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdjuntarComponent} from './adjuntar.component';

describe('AdjuntarComponent', () => {
  let component: AdjuntarComponent;
  let fixture: ComponentFixture<AdjuntarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdjuntarComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjuntarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
