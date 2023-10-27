import { ComponentFixture, TestBed } from '@angular/core/testing';
import {SignUpFlowComponent} from "./sign-up-flow.component";
import {DescopeComponent} from "../descope/descope.component";
import {MockComponent} from "ng-mocks";

describe('SignUpFlowComponent', () => {
  let component: SignUpFlowComponent;
  let fixture: ComponentFixture<SignUpFlowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent(DescopeComponent), SignUpFlowComponent],
    });

    fixture = TestBed.createComponent(SignUpFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
