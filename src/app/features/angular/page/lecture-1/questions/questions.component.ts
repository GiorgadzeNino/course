import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionsService, Question, Answer } from '../../../../../core/services/questions.service';

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
      question: 'რა როლი აქვს TypeScript-ს Angular-ში?',
      options: [
        'დიზაინის შექმნა',
        'კოდის ტიპიზაცია და ხარისხის გაუმჯობესება',
        'HTML-ის ჩანაცვლება',
        'მონაცემთა ბაზასთან კავშირი',
      ],
      correctAnswer: 2
    },
    {
      id: 4,
      question: 'რა ბრძანებით ვუშვებთ Angular აპლიკაციას development რეჟიმში?',
      options: [
        'ng serve',
        'ng run',
        'angular start'
      ],
      correctAnswer: 0
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
    },
    {
      id: 6,
      question: '______ serve',
      options: [
        'npm',
        'ng',
        'angular',
        'node'
      ],
      correctAnswer: 1
    }
  ];

  currentQuestionIndex = 0;
  answers: Answer[] = [];
  showResults = false;
  storageKey = 'lecture1_answers';

  constructor(private questionsService: QuestionsService) { }

  ngOnInit() {
    const initialized = this.questionsService.initializeQuiz(this.questions, this.storageKey);
    this.currentQuestionIndex = initialized.currentQuestionIndex;
    this.answers = initialized.answers;
    this.showResults = initialized.showResults;
  }

  get currentQuestion(): Question {
    return this.questionsService.getCurrentQuestion(this.questions, this.currentQuestionIndex);
  }

  get currentAnswer(): Answer | undefined {
    return this.questionsService.getCurrentAnswer(this.answers, this.currentQuestion.id);
  }

  get isAnswered(): boolean {
    return this.questionsService.isAnswered(this.answers, this.currentQuestion.id);
  }

  get isCorrect(): boolean {
    return this.questionsService.isCorrect(this.answers, this.currentQuestion.id);
  }

  get progress(): number {
    return this.questionsService.calculateProgress(this.answers, this.questions.length);
  }

  selectAnswer(optionIndex: number) {
    if (this.isAnswered) return;

    this.questionsService.selectAnswer(this.currentQuestion, optionIndex, this.answers, this.storageKey);
    this.answers = this.questionsService.loadAnswers(this.storageKey);

    // Auto-advance after showing result
    // setTimeout(() => {
    //   if (this.currentQuestionIndex < this.questions.length - 1) {
    //     this.nextQuestion();
    //   } else {
    //     this.showResults = true;
    //   }
    // }, 1500);
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
    return this.questionsService.getQuestionStatus(this.answers, questionId);
  }

  getTotalScore(): number {
    return this.questionsService.getTotalScore(this.answers);
  }

  getOptionLetter(index: number): string {
    return this.questionsService.getOptionLetter(index);
  }

  getSelectedAnswer(questionId: number): number {
    return this.questionsService.getSelectedAnswer(this.answers, questionId);
  }

  getSelectedOptionText(question: Question): string {
    return this.questionsService.getSelectedOptionText(question, this.answers);
  }

  getCorrectOptionText(question: Question): string {
    return this.questionsService.getCorrectOptionText(question);
  }

  resetQuiz() {
    this.answers = [];
    this.currentQuestionIndex = 0;
    this.showResults = false;
    this.questionsService.resetQuiz(this.storageKey);
  }
}

