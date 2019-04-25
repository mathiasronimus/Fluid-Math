import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFontLoadFailComponent } from './custom-font-load-fail.component';

describe('CustomFontLoadFailComponent', () => {
  let component: CustomFontLoadFailComponent;
  let fixture: ComponentFixture<CustomFontLoadFailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomFontLoadFailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomFontLoadFailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
