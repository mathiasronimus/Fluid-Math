import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentPaneComponent } from './content-pane.component';

describe('ContentPaneComponent', () => {
  let component: ContentPaneComponent;
  let fixture: ComponentFixture<ContentPaneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentPaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
