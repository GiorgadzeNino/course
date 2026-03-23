import { Component } from '@angular/core';

@Component({
  selector: 'app-lecture-4',
  templateUrl: './lecture-4.component.html',
  styleUrl: './lecture-4.component.scss'
})
export class Lecture4Component {
  httpUserServiceCode = `import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
`;

  httpUsersComponentCode = `import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-users',
  template: \`
    <ul>
      <li *ngFor="let user of users">{{ user.name }}</li>
    </ul>
  \`
})
export class UsersComponent implements OnInit {
  users: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
    });
  }
}
`;

  httpExampleFiles = [
    { name: 'user.service.ts', content: this.httpUserServiceCode },
    { name: 'users.component.ts', content: this.httpUsersComponentCode }
  ];

  componentExampleCode = `import { Component } from '@angular/core';
import { MyServiceService } from './my-service.service';

@Component({
  selector: 'app-home',
  template: \`<h1>{{ message }}</h1>\`
})
export class HomeComponent {
  message: string = '';

  constructor(private myService: MyServiceService) {}

  ngOnInit() {
    this.message = this.myService.greet('Angular');
  }
}
`;

  demoUsers = [
    { name: 'Leanne Graham' },
    { name: 'Ervin Howell' },
    { name: 'Clementine Bauch' }
  ];
}

