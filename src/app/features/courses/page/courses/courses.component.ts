import { Component } from '@angular/core';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent {

  courses = [
    {
      name: 'Angular',
      description: 'სრული, პრაქტიკული Angular კურსი Intermediate დონის დეველოპერებისთვის.',
      imageUrl: './assets/angular.png',
      route: ['/courses', 'angular'],
    },
    {
      name: 'RxJS',
      // description: 'Fundamentals of reactive programming and efficient data flow management.'
      imageUrl: './assets/rxjs.png'
    },
    {
      name: 'TypeScript',
      // description: 'Statically typed JavaScript for more reliable and readable code.'
      imageUrl: './assets/typescript.jpeg'
    }
  ];

}
