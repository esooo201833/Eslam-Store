import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col">
      <label *ngIf="label" [for]="id" class="block text-sm font-medium text-gray-700 mb-1">
        {{ label }}
        <span *ngIf="required" class="text-red-500">*</span>
      </label>
      <input
        [id]="id"
        [type]="type"
        [placeholder]="placeholder"
        [value]="value"
        [disabled]="disabled"
        [required]="required"
        [ngClass]="getInputClasses()"
        (input)="onInput($event)"
        (blur)="blur.emit($event)"
      />
      <span *ngIf="error" class="text-red-500 text-sm mt-1">{{ error }}</span>
    </div>
  `
})
export class InputComponent {
  @Input() id = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' = 'text';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() value = '';
  @Input() disabled = false;
  @Input() required = false;
  @Input() error = '';
  @Input() fullWidth = false;
  @Output() valueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<FocusEvent>();

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }

  getInputClasses(): string {
    const baseClasses = 'border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all';
    const errorClass = this.error ? 'border-red-500 focus:ring-red-500' : '';
    const widthClass = this.fullWidth ? 'w-full' : '';
    const disabledClass = this.disabled ? 'bg-gray-100 cursor-not-allowed' : '';
    return `${baseClasses} ${errorClass} ${widthClass} ${disabledClass}`;
  }
}
