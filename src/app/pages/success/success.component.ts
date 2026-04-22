import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../../components/layout/footer.component';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center">
      <div class="max-w-md w-full mx-4 bg-white rounded-lg shadow-sm">
        <div class="text-center py-12">
          <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <svg class="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p class="text-gray-600 mb-6">Thank you for your purchase.</p>
          
          <div class="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p class="text-sm text-gray-600">Order ID:</p>
            <p class="font-semibold">{{ orderId }}</p>
          </div>
          
          <div class="space-y-3">
            <button
              routerLink="/"
              class="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
            <button
              routerLink="/admin"
              class="w-full bg-gray-200 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              View Orders
            </button>
          </div>
        </div>
      </div>

      <app-footer></app-footer>
    </div>
  `
})
export class SuccessComponent implements OnInit {
  orderId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.queryParamMap.get('orderId') || 'Unknown';
  }
}
