import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderDocumentComponent } from './header-document.component';

describe('HeaderDocumentComponent', () => {
  let component: HeaderDocumentComponent;
  let fixture: ComponentFixture<HeaderDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
