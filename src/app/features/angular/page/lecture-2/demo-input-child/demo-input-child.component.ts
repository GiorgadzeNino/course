import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-demo-input-child',
  standalone: true,
  template: `
    <div class="demo-input-child">
      <h5>შვილი კომპონენტი (app-demo-input-child)</h5>
      <p><strong>მიღებულია მშობელი კომპონენტიდან &#64;Input()-ის დახმარებით:</strong></p>
      <p class="user-name-display">{{ userName || '(არ არის მიღებული)' }}</p>
    </div>
  `,
  styles: [`
    .demo-input-child {
      padding: 1.25rem;
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
    }
    
    .demo-input-child h5 {
      margin: 0 0 0.75rem 0;
      color: #0f172a;
      font-size: 1rem;
      font-weight: 600;
    }
    
    .demo-input-child p {
      margin: 0.5rem 0;
      color: #475569;
      font-size: 0.9rem;

      strong {
        color: #0f172a;
      }
    }

    .user-name-display {
      font-size: 1.1rem;
      font-weight: 600;
      color: #059669;
      background: #d1fae5;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      margin-top: 0.75rem;
      text-align: center;
    }
  `]
})
export class DemoInputChildComponent {
  @Input() userName: string = '';
}

