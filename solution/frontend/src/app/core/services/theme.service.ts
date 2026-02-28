import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'prometheus_theme';

  readonly isDark = signal(this.loadTheme());

  constructor() {
    effect(() => {
      const dark = this.isDark();
      document.documentElement.classList.toggle('dark', dark);
      localStorage.setItem(this.storageKey, dark ? 'dark' : 'light');
    });
  }

  toggle(): void {
    this.isDark.update(v => !v);
  }

  private loadTheme(): boolean {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
