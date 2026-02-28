import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { AppSetting } from '../../../core/models/admin.model';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, TimeAgoPipe],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Application Settings</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure application behavior</p>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <i class="fa-solid fa-spinner fa-spin text-2xl text-primary-500"></i>
        </div>
      } @else {
        <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
          @for (setting of settings(); track setting.key) {
            <div class="flex items-center justify-between gap-6 p-5 flex-wrap">
              <div class="flex-1 min-w-[200px]">
                <div class="flex items-center gap-2">
                  <i [class]="getSettingIcon(setting.key)"></i>
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatKey(setting.key) }}</span>
                </div>
                @if (setting.description) {
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 ml-6">{{ setting.description }}</p>
                }
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-1 ml-6">
                  <i class="fa-regular fa-clock mr-1"></i>Updated {{ setting.updatedAt | timeAgo }}
                </p>
              </div>

              <div class="flex items-center gap-2">
                @if (setting.key === 'ai_enabled') {
                  <button (click)="toggleBooleanSetting(setting)"
                          [class]="setting.value === 'true'
                            ? 'w-11 h-6 bg-primary-600 rounded-full relative transition-colors cursor-pointer'
                            : 'w-11 h-6 bg-gray-300 dark:bg-gray-700 rounded-full relative transition-colors cursor-pointer'">
                    <div [class]="setting.value === 'true'
                      ? 'absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-sm'
                      : 'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-sm'">
                    </div>
                  </button>
                  <span class="text-xs font-medium min-w-[28px]" [class]="setting.value === 'true' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'">
                    {{ setting.value === 'true' ? 'On' : 'Off' }}
                  </span>
                } @else if (setting.key === 'ai_provider') {
                  <select [ngModel]="setting.value" (ngModelChange)="updateSetting(setting.key, $event)"
                          class="px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white outline-none focus:border-primary-500 transition-colors">
                    <option value="Anthropic">Anthropic</option>
                    <option value="OpenAI">OpenAI</option>
                  </select>
                } @else {
                  <input type="text" [ngModel]="setting.value"
                         (blur)="updateSetting(setting.key, $any($event.target).value)"
                         class="w-24 px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-center outline-none focus:border-primary-500 transition-colors" />
                }
              </div>
            </div>
          } @empty {
            <div class="p-8 text-center text-gray-400 dark:text-gray-500">
              No settings found.
            </div>
          }
        </div>
      }
    </div>
  `
})
export class SettingsComponent implements OnInit {
  private adminService = inject(AdminService);

  settings = signal<AppSetting[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.adminService.getSettings().subscribe({
      next: settings => {
        this.settings.set(settings);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  formatKey(key: string): string {
    return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  getSettingIcon(key: string): string {
    const icons: Record<string, string> = {
      'archive_timeout_days': 'fa-solid fa-box-archive text-sm text-amber-500',
      'ai_enabled': 'fa-solid fa-robot text-sm text-purple-500',
      'ai_provider': 'fa-solid fa-microchip text-sm text-blue-500',
      'ai_trigger_delay_hours': 'fa-solid fa-clock text-sm text-green-500'
    };
    return icons[key] || 'fa-solid fa-gear text-sm text-gray-400';
  }

  toggleBooleanSetting(setting: AppSetting): void {
    const newValue = setting.value === 'true' ? 'false' : 'true';
    this.updateSetting(setting.key, newValue);
  }

  updateSetting(key: string, value: string): void {
    this.adminService.updateSetting(key, value).subscribe({
      next: () => {
        this.settings.update(settings =>
          settings.map(s => s.key === key ? { ...s, value, updatedAt: new Date().toISOString() } : s)
        );
      }
    });
  }
}
