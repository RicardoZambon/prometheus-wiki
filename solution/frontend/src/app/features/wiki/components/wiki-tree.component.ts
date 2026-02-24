import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wiki-tree',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="wiki-layout">
      <aside class="wiki-sidebar">
        <h2>Wiki Pages</h2>
        <p>Hierarchical tree navigation will be implemented here.</p>
      </aside>
    </div>
  `
})
export class WikiTreeComponent {}
