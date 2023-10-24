import {Component, ElementRef, Input, OnInit} from '@angular/core';
import DescopeWebComponent from "@descope/web-component"

@Component({
  selector: 'Descope',
  template: '',
  styleUrls: ['./descope.component.css']
})
export class DescopeComponent implements OnInit {
  @Input() projectId: string = '';
    constructor(private elementRef: ElementRef) {}

  ngOnInit() {
      const webComponent = new DescopeWebComponent();
      webComponent.setAttribute('project-id', this.projectId);
      webComponent.setAttribute('flow-id', 'sign-in');
      this.elementRef.nativeElement.appendChild(webComponent);
  }

  }
