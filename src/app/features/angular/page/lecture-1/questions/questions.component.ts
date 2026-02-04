import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Answer {
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
}

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  questions: Question[] = [
    {
      id: 1,
      question: 'რა არის Angular CLI-ს მთავარი ბრძანება ახალი პროექტის შესაქმნელად?',
      options: [
        'ng create',
        'ng new',
        'ng init',
        'ng start'
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: 'რა ბრძანებით შეგვიძლია შევამოწმოთ Angular CLI-ის ვერსია?',
      options: [
        'ng --version',
        'ng -v',
        'ng v',
        'ng version'
      ],
      correctAnswer: 2
    },
    {
      id: 3,
      question: 'რა არის Angular პროექტის მთავარი კონფიგურაციის ფაილი?',
      options: [
        'package.json',
        'angular.json',
        'tsconfig.json',
        'app.config.ts'
      ],
      correctAnswer: 1
    },
    {
      id: 4,
      question: 'რა ბრძანებით ვაშვებთ Angular აპლიკაციას development რეჟიმში?',
      options: [
        'npm start',
        'ng serve',
        'ng run',
        'angular start'
      ],
      correctAnswer: 1
    },
    {
      id: 5,
      question: 'რა პორტზე იწყება Angular აპლიკაცია ნაგულისხმევად?',
      options: [
        '3000',
        '4200',
        '8080',
        '5000'
      ],
      correctAnswer: 1
    }
  ];

  currentQuestionIndex = 0;
  answers: Answer[] = [];
  showResults = false;
  storageKey = 'lecture1_answers';

  ngOnInit() {
    this.loadAnswers();
  }

  get currentQuestion(): Question {
    return this.questions[this.currentQuestionIndex];
  }

  get currentAnswer(): Answer | undefined {
    return this.answers.find(a => a.questionId === this.currentQuestion.id);
  }

  get isAnswered(): boolean {
    return this.currentAnswer !== undefined;
  }

  get isCorrect(): boolean {
    return this.currentAnswer?.isCorrect ?? false;
  }

  get progress(): number {
    return ((this.answers.length / this.questions.length) * 100);
  }

  selectAnswer(optionIndex: number) {
    if (this.isAnswered) return;

    const isCorrect = optionIndex === this.currentQuestion.correctAnswer;
    const answer: Answer = {
      questionId: this.currentQuestion.id,
      selectedAnswer: optionIndex,
      isCorrect
    };

    this.answers.push(answer);
    this.saveAnswers();

    // Auto-advance after showing result
    setTimeout(() => {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.nextQuestion();
      } else {
        this.showResults = true;
      }
    }, 1500);
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  goToQuestion(index: number) {
    this.currentQuestionIndex = index;
  }

  getQuestionStatus(questionId: number): 'correct' | 'incorrect' | 'unanswered' {
    const answer = this.answers.find(a => a.questionId === questionId);
    if (!answer) return 'unanswered';
    return answer.isCorrect ? 'correct' : 'incorrect';
  }

  getTotalScore(): number {
    return this.answers.filter(a => a.isCorrect).length;
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  getSelectedAnswer(questionId: number): number {
    const answer = this.answers.find(a => a.questionId === questionId);
    return answer?.selectedAnswer ?? -1;
  }

  getSelectedOptionText(question: Question): string {
    const selectedIndex = this.getSelectedAnswer(question.id);
    if (selectedIndex === -1) return '';
    return question.options[selectedIndex];
  }

  getCorrectOptionText(question: Question): string {
    return question.options[question.correctAnswer];
  }

  resetQuiz() {
    this.answers = [];
    this.currentQuestionIndex = 0;
    this.showResults = false;
    localStorage.removeItem(this.storageKey);
  }

  private saveAnswers() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.answers));
  }

  private loadAnswers() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      this.answers = JSON.parse(saved);
      // Find first unanswered question
      const unansweredIndex = this.questions.findIndex(
        q => !this.answers.find(a => a.questionId === q.id)
      );
      if (unansweredIndex !== -1) {
        this.currentQuestionIndex = unansweredIndex;
      } else {
        this.showResults = true;
      }
    }
  }
}

