import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-topic-detail',
  standalone: true,
  template: `
    <div class="topic-detail">
      <h1>Topic Detail</h1>
      <p>Topic content, answers, voting, and "Mark as solution" will be implemented here.</p>
    </div>
  `
})
export class TopicDetailComponent {
  constructor(private route: ActivatedRoute) {}
}
