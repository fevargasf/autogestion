import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TableArchivosComponent} from './table-archivos.component';

describe('TableArchivosComponent', () => {
  let component: TableArchivosComponent;
  let fixture: ComponentFixture<TableArchivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableArchivosComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableArchivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
