import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Answer, Question, QuestionsService } from '../../../../../core/services/questions.service';

@Component({
    selector: 'app-questions-4',
    templateUrl: './questions.component.html',
    styleUrls: ['./questions.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Questions4Component implements OnInit {
    // You can freely update this array with lecture 4 questions.
    questions: Question[] = [
        {
            id: 1,
            question: 'რა არის Service Angular-ში?',
            options: [
                'კლასი, რომელიც შეიცავს ბიზნეს ლოჯიკას და გამოიყენება კომპონენტებში',
                'HTML template, რომელიც აჩვენებს მონაცემებს',
                'CSS ფაილი სტილების განსასაზღვრად',
                'Directive, რომელიც ცვლის DOM-ს'
            ],
            correctAnswer: 0
        },
        {
            id: 2,
            question: 'რატომ ვიყენებთ Service-ს Angular-ში?',
            options: [
                'HTML სტილების შესაცვლელად',
                'კოდის გასაზიარებლად და ლოჯიკის გამოსაყოფად component-ებიდან',
                'მხოლოდ routing-ისთვის',
                'Angular module-ის შესაქმნელად'
            ],
            correctAnswer: 1
        },
        {
            id: 3,
            question: 'რომელი CLI ბრძანება ქმნის Service-ს?',
            options: [
                'ng generate component service',
                'ng generate service my-service',
                'ng new service',
                'ng add service'
            ],
            correctAnswer: 1
        },
        {
            id: 4,
            question: 'რა ფუნქცია აქვს @Injectable დეკორატორს?',
            options: [
                'HTML template-ს ამატებს კლასს',
                'კლასს component-ად აქცევს',
                'აძლევს Angular-ს საშუალებას გამოიყენოს dependency injection',
                'სტილებს ამატებს კომპონენტს'
            ],
            correctAnswer: 2
        },
        {
            id: 5,
            question: 'რას ნიშნავს providedIn: "root"?',
            options: [
                'Service გამოიყენება მხოლოდ ერთ კომპონენტში',
                'Service არის singleton და ხელმისაწვდომია მთელ აპლიკაციაში',
                'Service გამოიყენება მხოლოდ მოდულში',
                'Service მუშაობს მხოლოდ development რეჟიმში'
            ],
            correctAnswer: 1
        },
        {
            id: 6,
            question: 'როგორ ვიღებთ Service-ს Component-ში?',
            options: [
                'HTML template-დან',
                'constructor-ში dependency injection-ის გამოყენებით',
                'CSS ფაილიდან',
                'Angular CLI-ის საშუალებით'
            ],
            correctAnswer: 1
        },
        {
            id: 7,
            question: 'Service-ის მთავარი მიზანი Angular-ში არის:',
            options: [
                'UI-ის რენდერინგი',
                'სტილების მართვა',
                'ბიზნეს ლოჯიკის და მონაცემების მართვა',
                'DOM ელემენტების შექმნა'
            ],
            correctAnswer: 2
        },
        {
            id: 8,
            question: 'რომელი შემთხვევისთვის გამოიყენება ხშირად Service?',
            options: [
                'API request-ების გასაკეთებლად',
                'HTML ფორმების დასაწერად',
                'CSS animation-ებისთვის',
                'Routing-ის დასაწერად'
            ],
            correctAnswer: 0
        },
        {
            id: 9,
            question: 'რა სარგებელი აქვს Service-ის გამოყენებას?',
            options: [
                'კოდი უფრო რთული ხდება',
                'კოდი ხდება უფრო ორგანიზებული და reusable',
                'HTML უფრო დიდი ხდება',
                'Angular უფრო ნელა მუშაობს'
            ],
            correctAnswer: 1
        },
        {
            id: 10,
            question: 'Angular-ში Service ჩვეულებრივ არის:',
            options: [
                'Directive',
                'TypeScript კლასი',
                'HTML ელემენტი',
                'CSS კლასი'
            ],
            correctAnswer: 1
        }
    ];

    currentQuestionIndex = 0;
    answers: Answer[] = [];
    showResults = false;
    storageKey = 'lecture4_answers';

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

