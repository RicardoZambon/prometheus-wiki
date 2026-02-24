import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="search-bar">
      <input type="text" [(ngModel)]="query" placeholder="Search topics & wiki..." (keyup.enter)="onSearch()" />
    </div>
  `,
  styles: [`
    .search-bar input { padding: 8px 16px; border: 1px solid #ddd; border-radius: 4px; width: 300px; }
  `]
})
export class SearchBarComponent {
  query = '';
  search = output<string>();

  onSearch(): void {
    this.search.emit(this.query);
  }
}
