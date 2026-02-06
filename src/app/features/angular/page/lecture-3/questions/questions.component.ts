import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Answer, Question, QuestionsService } from '../../../../../core/services/questions.service';

@Component({
    selector: 'app-questions-3',
    templateUrl: './questions.component.html',
    styleUrls: ['./questions.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Questions3Component implements OnInit {
    questions: Question[] = [
        {
            id: 1,
            question: 'რა არის Directive Angular-ში?',
            options: [
                'მექანიზმი, რომელიც ცვლის HTML ელემენტის ქცევას ან გარეგნობას',
                'კომპონენტი, რომელსაც აქვს template',
                'სერვისი, რომელიც მართავს მონაცემებს',
                'მოდული, რომელიც შეიცავს კომპონენტებს'
            ],
            correctAnswer: 0
        },
        {
            id: 2,
            question: 'რამდენი ტიპის Directive არსებობს Angular-ში?',
            options: [
                '1: მხოლოდ Structural',
                '2: Structural და Attribute',
                '3: Component, Structural და Attribute',
                '4: Component, Structural, Attribute და Custom'
            ],
            correctAnswer: 2
        },
        {
            id: 3,
            question: 'რომელია Structural Directive-ის სწორი სინტაქსი?',
            options: [
                '*ngIf="condition"',
                'ngIf="condition"',
                '[ngIf]="condition"',
                '(ngIf)="condition"'
            ],
            correctAnswer: 0
        },
        {
            id: 4,
            question: 'რა განსხვავებაა @if და *ngIf-ს შორის?',
            options: [
                'არანაირი განსხვავება, ერთი და იგივეა',
                '@if არის ახალი Angular-ის სინტაქსი, *ngIf არის ძველი',
                '*ngIf არის ახალი, @if არის ძველი',
            ],
            correctAnswer: 1
        },
        {
            id: 5,
            question: 'რა არის ngClass directive-ის მიზანი?',
            options: [
                'DOM-ის სტრუქტურის შეცვლა',
                'დინამიური CSS კლასების დამატება',
                'მონაცემების გამოტანა',
                'მოვლენების დამუშავება'
            ],
            correctAnswer: 1
        },
        {
            id: 6,
            question: 'რა არის ngStyle directive-ის მიზანი?',
            options: [
                'CSS კლასების დამატება',
                'დინამიური inline სტილების დამატება',
                'HTML სტრუქტურის შეცვლა',
                'კომპონენტის შექმნა'
            ],
            correctAnswer: 1
        },
    ];

    currentQuestionIndex = 0;
    answers: Answer[] = [];
    showResults = false;
    storageKey = 'lecture3_answers';

    constructor(
        private questionsService: QuestionsService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        const initialized = this.questionsService.initializeQuiz(this.questions, this.storageKey);
        this.currentQuestionIndex = initialized.currentQuestionIndex;
        this.answers = initialized.answers;
        this.showResults = initialized.showResults;
        this.cdr.markForCheck();
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

    get isLastQuestion(): boolean {
        return this.currentQuestionIndex === this.questions.length - 1;
    }

    get canShowResults(): boolean {
        return this.answers.length === this.questions.length;
    }

    getOptionLetter(index: number): string {
        return String.fromCharCode(65 + index);
    }

    selectAnswer(optionIndex: number) {
        if (this.isAnswered) return;

        this.questionsService.selectAnswer(this.currentQuestion, optionIndex, this.answers, this.storageKey);
        this.answers = this.questionsService.loadAnswers(this.storageKey);
        this.cdr.markForCheck();

        if (this.isLastQuestion && this.canShowResults) {
            setTimeout(() => {
                this.showResults = true;
                this.cdr.markForCheck();
            }, 300);
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.cdr.markForCheck();
        }
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.cdr.markForCheck();
        }
    }

    goToQuestion(index: number) {
        this.currentQuestionIndex = index;
        this.cdr.markForCheck();
    }

    finishQuiz() {
        if (!this.canShowResults) return;
        this.showResults = true;
        this.cdr.markForCheck();
    }

    resetQuiz() {
        this.questionsService.resetQuiz(this.storageKey);
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.showResults = false;
        this.cdr.markForCheck();
    }

    getTotalScore(): number {
        return this.questionsService.getTotalScore(this.answers);
    }

    getScorePercentage(): number {
        const score = this.getTotalScore();
        return Math.round((score / this.questions.length) * 100);
    }

    get isPassed(): boolean {
        return this.getTotalScore() === this.questions.length;
    }

    getSelectedAnswer(questionId: number): number | undefined {
        const answer = this.answers.find(a => a.questionId === questionId);
        return answer?.selectedAnswer;
    }

    getSelectedOptionText(questionId: number): string {
        const question = this.questions.find(q => q.id === questionId);
        if (question) {
            return this.questionsService.getSelectedOptionText(question, this.answers);
        }
        return '';
    }

    getCorrectOptionText(questionId: number): string {
        const question = this.questions.find(q => q.id === questionId);
        if (question) {
            return this.questionsService.getCorrectOptionText(question);
        }
        return '';
    }

    getQuestionStatus(questionId: number): 'correct' | 'incorrect' | 'unanswered' {
        return this.questionsService.getQuestionStatus(this.answers, questionId);
    }
}

