import { Component } from '@angular/core';

@Component({
  selector: 'app-lecture-2',
  templateUrl: './lecture-2.component.html',
  styleUrl: './lecture-2.component.scss',
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
}
