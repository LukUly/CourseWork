import { Component } from '@angular/core';
import { TestControlComponent } from './test-control/test-control.component';
import { TestResultsComponent, TestLogEntry } from './test-results/test-results.component';
import { ConfigEditorComponent } from './config-editor/config-editor.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TestControlComponent, TestResultsComponent, ConfigEditorComponent],
  template: `
    <h1 style="text-align: center; margin: 24px 0;">🧪 Automated Testing Suite</h1>
    <app-test-control (testCompleted)="onTestCompleted($event)"></app-test-control>
    <app-config-editor></app-config-editor>
    <app-test-results [logs]="logs"></app-test-results>
  `
})
export class AppComponent {
  logs: TestLogEntry[] = [];

  onTestCompleted(log: TestLogEntry) {
    this.logs.unshift(log);
    if (this.logs.length > 10) this.logs.pop(); // ограничим до 10
  }
}
