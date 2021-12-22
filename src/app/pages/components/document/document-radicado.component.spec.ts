import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentRadicadoComponent } from './document-radicado.component';

describe('DocumentRadicadoComponent', () => {
  let component: DocumentRadicadoComponent;
  let fixture: ComponentFixture<DocumentRadicadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentRadicadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentRadicadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
