import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getCardClasses()">
      @if (header) {
        <div class="border-b border-gray-200 px-6 py-4">
          <ng-content select="[header]"></ng-content>
        </div>
      }
      <div class="p-6">
        <ng-content></ng-content>
      </div>
      @if (footer) {
        <div class="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <ng-content select="[footer]"></ng-content>
        </div>
      }
    </div>
  `
})
export class CardComponent {
  @Input() hover = false;
  @Input() header = false;
  @Input() footer = false;

  getCardClasses(): string {
    const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200';
    const hoverClass = this.hover ? 'hover:shadow-md transition-shadow duration-200' : '';
    return `${baseClasses} ${hoverClass}`;
  }
}
