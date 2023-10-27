import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpOrInFlowComponent } from './sign-up-or-in-flow.component';

describe('SignUpOrInFlowComponent', () => {
  let component: SignUpOrInFlowComponent;
  let fixture: ComponentFixture<SignUpOrInFlowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignUpOrInFlowComponent]
    });
    fixture = TestBed.createComponent(SignUpOrInFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
