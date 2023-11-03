import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignUpOrInFlowComponent } from './sign-up-or-in-flow.component';
import { DescopeComponent } from '../descope/descope.component';
import { MockComponent } from 'ng-mocks';

describe('SignUpOrInFlowComponent', () => {
	let component: SignUpOrInFlowComponent;
	let fixture: ComponentFixture<SignUpOrInFlowComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [MockComponent(DescopeComponent), SignUpOrInFlowComponent]
		});

		fixture = TestBed.createComponent(SignUpOrInFlowComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});