import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  template: `
    <div class="settings">
      <h1>App Settings</h1>
      <p>Application settings form (timeout days, AI config, etc.) will be implemented here.</p>
    </div>
  `
})
export class SettingsComponent {}
