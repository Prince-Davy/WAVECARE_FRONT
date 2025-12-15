
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-search-bar',
  imports: [
    TranslateModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatChipsModule,
    FormsModule,
    MatIconModule
],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {

  getTranslationResultsFound(results: number): string {
    return results > 1 ? 'feature.dashboard.search-bar.search-bar-component.result-found-second-part.plural' : 'feature.dashboard.search-bar.search-bar-component.result-found-second-part.singular'
  }

  listKeywords: string[] = [];
  inputValue: string = '';

  @Input() totalResults: number = 0;
  @Output() keywordsChanged = new EventEmitter<string[]>();
  

	@Output() resetRequested = new EventEmitter<void>();

	onReset(): void {
		this.removeAllKeywords();
		this.resetRequested.emit();
	}


  addKeyword(): void {
    const trimmed = this.inputValue?.trim();
    if (trimmed && !this.listKeywords.includes(trimmed)) {
      if (this.listKeywords.length < 4) {
        this.listKeywords.push(trimmed.toLowerCase());
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
