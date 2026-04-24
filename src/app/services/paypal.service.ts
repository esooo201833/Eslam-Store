import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

declare var paypal: any;

@Injectable({
  providedIn: 'root'
})
export class PayPalService {
  private clientId: string = environment.paypalClientId;

  constructor() {}

  loadPayPalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof paypal !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${this.clientId}&currency=USD`;
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
      document.body.appendChild(script);
    });
  }

  renderPayPalButton(containerId: string, amount: number, onSuccess: (details: any) => void): void {
    if (typeof paypal === 'undefined') {
      console.error('PayPal SDK not loaded');
      return;
    }

    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: amount.toFixed(2)
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          onSuccess(details);
        });
      },
      onError: (err: any) => {
        console.error('PayPal error:', err);
      }
    }).render(`#${containerId}`);
  }
}
