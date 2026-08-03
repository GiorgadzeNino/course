import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { RxjsCourseComponent } from './rxjs-course.component';

describe('RxjsCourseComponent', () => {
  let component: RxjsCourseComponent;
  let fixture: ComponentFixture<RxjsCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RxjsCourseComponent],
      imports: [RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(RxjsCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
