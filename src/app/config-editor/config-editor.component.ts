// src/app/config-editor/config-editor.component.ts

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

@Component({
  selector: 'app-config-editor',
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
  templateUrl: './config-editor.component.html',
  styleUrls: ['./config-editor.component.scss']
})
export class ConfigEditorComponent implements OnInit {
  hostname: string = '';
  testType: string = 'login';
  selectors: { key: string, value: string }[] = [
    { key: 'username', value: '' },
    { key: 'password', value: '' },
    { key: 'submit', value: '' }
  ];
  status: string = '';
  existingConfigs: { [host: string]: string[] } = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadConfigs();
  }

  loadConfigs() {
    this.http.get<{ [host: string]: { [testType: string]: any } }>('http://localhost:3000/configs')
      .subscribe((configs) => {
        this.existingConfigs = {};
        for (const host of Object.keys(configs)) {
          this.existingConfigs[host] = Object.keys(configs[host]);
        }
      });
  }

  addField() {
    this.selectors.push({ key: '', value: '' });
  }

  removeField(index: number) {
    this.selectors.splice(index, 1);
  }

  isEmpty(obj: any): boolean {
    return Object.keys(obj).length === 0;
  }

  saveConfig() {
    const selectorObject: { [key: string]: string } = {};
    for (const s of this.selectors) {
      if (s.key.trim()) {
        selectorObject[s.key.trim()] = s.value;
      }
    }

    const payload = {
      hostname: this.hostname,
      testType: this.testType,
      selectors: selectorObject
    };

    this.http.post('http://localhost:3000/configs', payload).subscribe({
      next: (res: any) => {
        this.status = res.message;
        this.loadConfigs();
      },
      error: err => this.status = '❌ Error: ' + err.message
    });
  }
}