import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-topic-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="topic-list">
      <h1>Q&A Topics</h1>
      <p>Topic list with filters will be implemented here.</p>
    </div>
  `
})
export class TopicListComponent {}
