import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInFlowComponent } from './sign-in-flow.component';

describe('SignInFlowComponent', () => {
  let component: SignInFlowComponent;
  let fixture: ComponentFixture<SignInFlowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignInFlowComponent]
    });
    fixture = TestBed.createComponent(SignInFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
