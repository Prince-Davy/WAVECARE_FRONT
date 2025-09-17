import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {MatChipsModule} from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms'
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-search-bar',
  imports: [
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    FormsModule,
    MatIconModule,
    CommonModule
],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  
  listKeywords: string[] = [];
  inputValue: string = '';

  @Input() resultCount: number = 0;
  @Output() keywordsChanged = new EventEmitter<string[]>();

  addKeyword(): void {
    const trimmed = this.inputValue?.trim();
    if (trimmed && !this.listKeywords.includes(trimmed)) {
      if (this.listKeywords.length < 4) {
        this.listKeywords.push(trimmed);
        this.keywordsChanged.emit(this.listKeywords);
      }
    }
    this.inputValue = '';
  }

  removeKeyword(keyword: string): void {
    const index = this.listKeywords.indexOf(keyword);

    if (index >= 0) {
      this.listKeywords.splice(index, 1);
      this.keywordsChanged.emit(this.listKeywords);
    }
  }

  removeAllKeywords(): void {
    this.listKeywords = [];
    this.keywordsChanged.emit(this.listKeywords);
  }
}