import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputDocumentComponent } from './output-document.component';

describe('OutputDocumentComponent', () => {
  let component: OutputDocumentComponent;
  let fixture: ComponentFixture<OutputDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutputDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
