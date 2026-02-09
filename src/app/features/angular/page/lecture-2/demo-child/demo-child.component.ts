import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-demo-child',
  standalone: true,
  template: `
    <div class="demo-child">
      <h5>შვილი კომპონენტი (app-demo-child)</h5>
      <p><strong>მიღებულია მშობელი კომპონენტიდან:</strong> {{ userName }}</p>
      <button (click)="sendMessage()" class="demo-button">
        Send Message to Parent
      </button>
    </div>
  `,
  styles: [`
    .demo-child {
      padding: 1rem;
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      margin-top: 1rem;
    }
    
    .demo-child h5 {
      margin: 0 0 0.75rem 0;
      color: #0f172a;
      font-size: 1rem;
    }
    
    .demo-child p {
      margin: 0.5rem 0;
      color: #475569;
      font-size: 0.9rem;
    }
    
    .demo-button {
      margin-top: 0.75rem;
      padding: 0.5rem 1rem;
      background: #0f172a;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s ease;
    }
    
    .demo-button:hover {
      background: #1e293b;
      transform: translateY(-1px);
    }
    
    .demo-button:active {
      transform: translateY(0);
    }
  `]
})
export class DemoChildComponent {
  @Input() userName: string = '';
  @Output() messageSent = new EventEmitter<string>();

  sendMessage() {
    this.messageSent.emit('Hello from child!');
  }
}

