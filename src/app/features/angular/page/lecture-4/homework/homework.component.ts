import { Component, ChangeDetectionStrategy } from '@angular/core';

export interface Homework {
  id: number;
  title: string;
  level: 'basic' | 'intermediate' | 'advanced';
  description: string;
  tasks: string[];
}

@Component({
  selector: 'app-homework-4',
  templateUrl: './homework.component.html',
  styleUrls: ['./homework.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Homework4Component {
  homeworks: Homework[] = [
    {
      id: 1,
      title: 'დავალება 1: First Service',
      level: 'basic',
      description: 'შექმენი პირველი Angular Service და გამოიყენე ის component-ში.',
      tasks: [
        'Angular CLI-ით შექმენი service სახელად greeting',
        'service-ში შექმენი ფუნქცია getMessage(), რომელიც აბრუნებს ტექსტს "Hello Angular Student!"',
        'შექმენი component სახელად home',
        'inject გააკეთე GreetingService component-ის constructor-ში',
        'HTML-ში გამოიტანე service-დან მიღებული ტექსტი'
      ]
    },
    {
      id: 2,
      title: 'დავალება 2: UserService',
      level: 'basic',
      description: 'შექმენი service, რომელიც შეინახავს მომხმარებლის მონაცემს.',
      tasks: [
        'შექმენი service სახელად user',
        'service-ში დაამატე ცვლადი userName',
        'დაამატე ორი მეთოდი: setUserName(name: string) და getUserName()',
        'შექმენი ორი component: sender და receiver',
        'sender component-იდან დააყენე userName მნიშვნელობა',
        'receiver component-ში გამოიტანე service-დან მიღებული userName'
      ]
    },
    {
      id: 3,
      title: 'დავალება 3: CounterService',
      level: 'intermediate',
      description: 'შექმენი service, რომელიც მართავს counter-ს და გამოიყენე რამდენიმე component-ში.',
      tasks: [
        'შექმენი service სახელად counter',
        'service-ში დაამატე ცვლადი count = 0',
        'შექმენი მეთოდები increment() და decrement()',
        'შექმენი component სახელად counter-buttons',
        'buttons component-ში დაამატე ორი ღილაკი Increment და Decrement',
        'შექმენი მეორე component counter-display',
        'display component-ში აჩვენე count მნიშვნელობა service-დან'
      ]
    },
    {
      id: 4,
      title: 'დავალება 4: ProductService',
      level: 'intermediate',
      description: 'შექმენი service, რომელიც ინახავს პროდუქტების სიას.',
      tasks: [
        'შექმენი service სახელად product',
        'service-ში შექმენი მასივი products',
        'დაამატე მეთოდი getProducts() რომელიც აბრუნებს მასივს',
        'შექმენი component product-list',
        'component-ში მიიღე პროდუქტების სია service-დან',
        'HTML-ში გამოიტანე პროდუქტები *ngFor-ის გამოყენებით'
      ]
    },
    {
      id: 5,
      title: 'დავალება 5: Shared Data Service',
      level: 'advanced',
      description: 'შექმენი service, რომელიც გამოიყენება მონაცემების გასაზიარებლად ორ component-ს შორის.',
      tasks: [
        'შექმენი service სახელად shared-data',
        'service-ში დაამატე ცვლადი message',
        'დაამატე მეთოდები setMessage() და getMessage()',
        'შექმენი component message-sender',
        'sender component-იდან შეცვალე message მნიშვნელობა',
        'შექმენი component message-receiver',
        'receiver component-ში აჩვენე message მნიშვნელობა'
      ]
    }
  ];

  getLevelClass(level: string): string {
    switch (level) {
      case 'basic':
        return 'level-basic';
      case 'intermediate':
        return 'level-intermediate';
      case 'advanced':
        return 'level-advanced';
      default:
        return '';
    }
  }

  getLevelLabel(level: string): string {
    switch (level) {
      case 'basic':
        return 'მარტივი დონე';
      case 'intermediate':
        return 'საშუალო დონე';
      case 'advanced':
        return 'რთული დონე';
      default:
        return level;
    }
  }
}

