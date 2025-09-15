import { Component, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {MatChipsModule} from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms'
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-ticket-search-bar',
  imports: [
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    FormsModule,
    MatIconModule,
    CommonModule
],
  templateUrl: './ticket-search-bar.component.html',
  styleUrl: './ticket-search-bar.component.scss'
})
export class TicketSearchBarComponent {
  listKeywords: string[] = [];
  inputValue: string = '';

  addKeyword() {
    const value = this.inputValue.trim();
    if (value && !this.listKeywords.includes(value)) {
      this.listKeywords.push(value);
      this.inputValue = '';
    }
  }

  removeKeyword(index: number) {
    this.listKeywords.splice(index, 1);
  }

  removeAllKeywords() {
  this.listKeywords = [];
  }
}