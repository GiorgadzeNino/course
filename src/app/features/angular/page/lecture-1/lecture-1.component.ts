import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-lecture-1',
  templateUrl: './lecture-1.component.html',
  styleUrl: './lecture-1.component.scss'
})
export class Lecture1Component implements OnInit {
  showQuestions = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => {
          const element = document.getElementById(fragment);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Offset for fixed header
            window.scrollBy(0, -56);
          }
        }, 100);
      }
    });
  }

  toggleQuestions() {
    this.showQuestions = !this.showQuestions;
    if (this.showQuestions) {
      setTimeout(() => {
        const element = document.getElementById('questions');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          window.scrollBy(0, -56);
        }
      }, 100);
    }
  }
}
