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
    private viewportScroller: ViewportScroller
  ) { }

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

  openQuestions() {
    if (!this.showQuestions) {
      this.showQuestions = true;
    }
    setTimeout(() => {
      const element = document.getElementById('questions_1');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  }
}
