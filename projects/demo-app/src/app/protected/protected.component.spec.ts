import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtectedComponent } from './protected.component';

describe('ProtectedComponent', () => {
  let component: ProtectedComponent;
  let fixture: ComponentFixture<ProtectedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProtectedComponent]
    });
    fixture = TestBed.createComponent(ProtectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
