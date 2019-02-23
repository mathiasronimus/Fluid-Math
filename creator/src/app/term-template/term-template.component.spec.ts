import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermTemplateComponent } from './term-template.component';

describe('TermTemplateComponent', () => {
  let component: TermTemplateComponent;
  let fixture: ComponentFixture<TermTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
