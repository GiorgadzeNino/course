import { Component } from '@angular/core';

@Component({
  selector: 'app-angular-course',
  templateUrl: './angular-course.component.html',
  styleUrls: ['./angular-course.component.scss'],
})
export class AngularCourseComponent {

  /** Static payment details shown on the enrol card — replace with the real ones. */
  readonly payment = {
    price: '29 ₾',
    bank: 'TBC Bank',
    iban: 'GE00TB0000000000000000',
    recipient: 'ტესტ ტესტ',
    purpose: 'Angular კურსი + შენი ელფოსტა',
  };
}


