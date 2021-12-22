import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TableResolucionComponent} from './table-resolucion.component';

describe('TableResolucionComponent', () => {
  let component: TableResolucionComponent;
  let fixture: ComponentFixture<TableResolucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableResolucionComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableResolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
