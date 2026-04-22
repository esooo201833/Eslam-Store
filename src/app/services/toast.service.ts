import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<ToastMessage>();
  public toast$ = this.toastSubject.asObservable();

  showToast(message: ToastMessage): void {
    this.toastSubject.next(message);
  }

  success(message: string, duration: number = 3000): void {
    this.showToast({ type: 'success', message, duration });
  }

  error(message: string, duration: number = 5000): void {
    this.showToast({ type: 'error', message, duration });
  }

  info(message: string, duration: number = 3000): void {
    this.showToast({ type: 'info', message, duration });
  }
}
