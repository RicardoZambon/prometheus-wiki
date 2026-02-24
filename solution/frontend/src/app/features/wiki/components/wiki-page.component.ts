import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-wiki-page',
  standalone: true,
  template: `
    <div class="wiki-page">
      <h1>Wiki Page</h1>
      <p>Page viewer with language selector and version history will be implemented here.</p>
    </div>
  `
})
export class WikiPageComponent {
  constructor(private route: ActivatedRoute) {}
}
