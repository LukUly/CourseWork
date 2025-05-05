// src/app/test-results/test-results.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

export interface TestLogEntry {
  url: string;
  testType: string;
  result: string;
  timestamp: string;
}

@Component({
  selector: 'app-test-results',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDividerModule, MatIconModule],
  templateUrl: './test-results.component.html',
  styleUrls: ['./test-results.component.scss']
})
export class TestResultsComponent {
  @Input() logs: TestLogEntry[] = [];
}