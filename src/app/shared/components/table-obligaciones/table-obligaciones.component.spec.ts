import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TableObligacionesComponent} from './table-obligaciones.component';

describe('TableObligacionesComponent', () => {
  let component: TableObligacionesComponent;
  let fixture: ComponentFixture<TableObligacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableObligacionesComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableObligacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
