import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ILogger} from "@descope/web-component";

@Component({
  selector: 'descope-sign-up-or-in-flow[projectId]',
  templateUrl: './sign-up-or-in-flow.component.html',
})
export class SignUpOrInFlowComponent {
  @Input() projectId: string;

  @Input() locale: string;
  @Input() theme: 'light' | 'dark' | 'os';
  @Input() tenant: string;
  @Input() telemetryKey: string;
  @Input() redirectUrl: string;
  @Input() autoFocus: true | false | 'skipFirstScreen';

  @Input() debug: boolean;
  @Input() errorTransformer: (error: { text: string; type: string }) => string;
  @Input() logger: ILogger;

  @Output() success: EventEmitter<void> = new EventEmitter<void>();
  @Output() error: EventEmitter<void> = new EventEmitter<void>();
}
