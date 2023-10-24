import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescopeComponent } from './descope.component';

describe('DescopeComponent', () => {
  let component: DescopeComponent;
  let fixture: ComponentFixture<DescopeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DescopeComponent]
    });
    fixture = TestBed.createComponent(DescopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
