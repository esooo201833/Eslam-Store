import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './components/ui/toast.component';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  toastMessage: { type: 'success' | 'error' | 'info'; message: string } | null = null;

  constructor(private toastService: ToastService) {
    this.toastService.toast$.subscribe(message => {
      this.toastMessage = message;
      setTimeout(() => {
        this.toastMessage = null;
      }, message.duration || 3000);
    });
  }
}
