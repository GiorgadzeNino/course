import { Component } from '@angular/core';

@Component({
  selector: 'app-lecture-2',
  templateUrl: './lecture-2.component.html',
  styleUrl: './lecture-2.component.scss'
})
export class Lecture2Component {
  activeTab: 'old' | 'new' = 'old';
  showQuestions = false;

  setActiveTab(tab: 'old' | 'new') {
    this.activeTab = tab;
  }

  openQuestions() {
    this.showQuestions = true;
    setTimeout(() => {
      const element = document.getElementById('questions_2');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  // Interactive demo properties
  demoUserName = 'John Doe';
  demoMessage = '';

  onDemoMessageReceived(msg: string) {
    this.demoMessage = msg;
  }

  // @Input() interactive demo
  inputDemoName = 'John Doe';

  inputInteractiveCode = `// Parent Component (app.component.ts)
export class AppComponent {
  name = 'John Doe'; // ← შეგიძლიათ შეცვალოთ ზემოთ
}

// Parent Template (app.component.html)
<app-header [userName]="name"></app-header>

// Child Component (header.component.ts)
export class HeaderComponent {
  @Input() userName: string = ''; // ← მიიღებს name-ს Parent-იდან
}

// Child Template (header.component.html)
<h1>Welcome, {{ userName }}!</h1>`;

  // Code examples for communication section
  componentHierarchyCode = `// app.component.html
<app-header></app-header>
<app-content></app-content>
<app-footer></app-footer>

// იერარქია:
// app (მშობელი)
//   ├── header (შვილი)
//   ├── content (შვილი)
//   └── footer (შვილი)`;

  inputExampleCode = `// ========== PARENT COMPONENT ==========
// 1. Parent Component (app.component.ts)
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  name = 'John Doe';
}

// 2. Parent Component Template (app.component.html)
<app-header [userName]="name"></app-header>

// ========== CHILD COMPONENT ==========
// 3. Child Component (header.component.ts)
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  // @Input() სინტაქსის ვარიანტები:
  
  // ვარიანტი 1: ძირითადი სინტაქსი
  @Input() userName: string = '';
  
  // ვარიანტი 2: Non-null assertion (!) - როდესაც დარწმუნებული ხართ რომ მნიშვნელობა იქნება
  @Input() product!: Product;
  
  // ვარიანტი 3: Optional (?) - როდესაც მნიშვნელობა შეიძლება იყოს undefined
  @Input() optionalData?: string;
  
  // ვარიანტი 4: Custom property name - გარედან სხვა სახელით გადაცემა
  @Input('customName') internalName: string = '';
}

// 4. Child Component Template (header.component.html)
<h1>Welcome, {{ userName }}!</h1>
<p>Product: {{ product?.name }}</p>`;

  outputExampleCode = `// ========== CHILD COMPONENT ==========
// 1. Child Component (button.component.ts)
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html'
})
export class ButtonComponent {
  // @Output() სინტაქსის ვარიანტები:
  
  // ვარიანტი 1: ძირითადი სინტაქსი
  @Output() buttonClick = new EventEmitter<string>();
  
  // ვარიანტი 2: Custom event name - გარედან სხვა სახელით
  @Output('customEvent') internalEvent = new EventEmitter<number>();
  
  // ვარიანტი 3: Complex data type
  @Output() userSelected = new EventEmitter<User>();

  onClick() {
    this.buttonClick.emit('Button was clicked!');
  }
}

// 2. Child Component Template (button.component.html)
<button (click)="onClick()">Click Me</button>

// ========== PARENT COMPONENT ==========
// 3. Parent Component Template (app.component.html)
<app-button (buttonClick)="handleClick($event)"></app-button>

// 4. Parent Component (app.component.ts)
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  handleClick(message: string) {
    console.log(message); // "Button was clicked!"
  }
}`;

  fullExampleCode = `// ========== PARENT COMPONENT ==========
// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  userName = 'John Doe';
  message = '';

  onMessageReceived(msg: string) {
    this.message = msg;
    console.log('Received:', msg);
  }
}

// app.component.html
<div>
  <h1>Parent Component</h1>
  <p>User: {{ userName }}</p>
  <p>Message from child: {{ message }}</p>
  
  <!-- Input: გადავცემთ userName-ს -->
  <!-- Output: ვიღებთ message-ს -->
  <app-child 
    [userName]="userName"
    (messageSent)="onMessageReceived($event)">
  </app-child>
</div>

// ========== CHILD COMPONENT ==========
// child.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html'
})
export class ChildComponent {
  @Input() userName: string = '';
  @Output() messageSent = new EventEmitter<string>();

  sendMessage() {
    this.messageSent.emit('Hello from child!');
  }
}

// child.component.html
<div>
  <h2>Child Component</h2>
  <p>Received from parent: {{ userName }}</p>
  <button (click)="sendMessage()">Send Message to Parent</button>
</div>`;
}
