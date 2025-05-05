// src/app/test-control/test-control.component.ts

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Output, EventEmitter } from '@angular/core';
import { TestLogEntry } from '../test-results/test-results.component';

@Component({
  selector: 'app-test-control',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule
  ],
  templateUrl: './test-control.component.html',
  styleUrls: ['./test-control.component.scss']
})
export class TestControlComponent implements OnInit {
  @Output() testCompleted = new EventEmitter<TestLogEntry>();
  
  url: string = '';
  testType: string = '';
  availableTestTypes: string[] = [];
  allTestTypes: string[] = [];
  configs: { [host: string]: { [testType: string]: any } } = {};
  status: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<{ [host: string]: { [testType: string]: any } }>('http://localhost:3000/configs')
      .subscribe(configs => {
        this.configs = configs;
        const allTypes = new Set<string>();
        Object.values(configs).forEach(site => {
          Object.keys(site).forEach(type => allTypes.add(type));
        });
        this.allTestTypes = Array.from(allTypes);
        this.availableTestTypes = this.allTestTypes;
      });
  }

  onUrlChange() {
    if (!this.url) {
      this.availableTestTypes = this.allTestTypes;
      return;
    }
    try {
      const hostname = new URL(this.url).hostname;
      const siteConfig = this.configs[hostname];
      if (siteConfig) {
        this.availableTestTypes = Object.keys(siteConfig);
        this.testType = this.availableTestTypes[0] || '';
      } else {
        this.availableTestTypes = [];
        this.testType = '';
      }
    } catch (e) {
      this.availableTestTypes = this.allTestTypes;
    }
  }

  runTest() {
    const payload = {
      url: this.url,
      testType: this.testType,
      browser: 'chrome'
    };

    this.http.post('http://localhost:3000/run-test', payload).subscribe({
      next: (res: any) => {
        this.status = res.message;
        this.testCompleted.emit({
          url: this.url,
          testType: this.testType,
          result: res.message,
          timestamp: new Date().toLocaleString()
        });
      },
      error: err => {
        const msg = '❌ ' + err.message;
        this.status = msg;
        this.testCompleted.emit({
          url: this.url,
          testType: this.testType,
          result: msg,
          timestamp: new Date().toLocaleString()
        });
      }
    });    
  }
}