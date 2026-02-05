import { Component, OnInit } from '@angular/core';
import { Answer, Question, QuestionsService } from '../../../../../core/services/questions.service';

@Component({
    selector: 'app-questions-2',
    templateUrl: './questions.component.html',
    styleUrls: ['./questions.component.scss']
})
export class Questions2Component implements OnInit {
    questions: Question[] = [
        {
            id: 1,
            question: 'რა არის Angular კომპონენტი?',
            options: [
                'კლასი, რომელიც Angular-ში წარმოადგენს UI-ს ერთ-ერთ ნაწილს',
                'HTML ფაილი, რომელიც შეიცავს სტილს',
                'CSS ფაილი, რომელიც განსაზღვრავს კომპონენტის დიზაინს',
                'კომბინაცია Node.js და Angular CLI ბრძანებების'
            ],
            correctAnswer: 0
        },
        {
            id: 2,
            question: 'როგორ მუშაობს Template და Component Class ერთმანეთთან?',
            options: [
                'Template არის Angular-ის ლოგიკა, Class არის UI',
                'Class შეიცავს მონაცემებს და მეთოდებს, Template აჩვენებს UI-ს და უკავშირდება Class-ის მონაცემებს',
                'Template არის სტილი, Class არის HTML',
                'Template და Class დამოუკიდებელნი არიან და ერთმანეთს არასოდეს უკავშირდება'
            ],
            correctAnswer: 1
        },
        {
            id: 3,
            question: 'Angular-ში Data Binding-ის რამდენი ტიპი არსებობს?',
            options: [
                '2: Interpolation და Property Binding',
                '3: Interpolation, Property Binding და Event Binding',
                '4: Interpolation, Property Binding, Event Binding და Two-way Binding',
                '5: Interpolation, Property Binding, Event Binding, Two-way Binding და Style Binding'
            ],
            correctAnswer: 2
        },
        {
            id: 4,
            question: 'რა არის Two-way Binding Angular-ში?',
            options: [
                'მხოლოდ HTML ელემენტის ტექსტის ჩვენება Class-ის ცვლადიდან',
                'HTML ელემენტის ცვლილების ავტომატური განახლება Class-ის ცვლადში და პირიქით',
                'Class-ის მეთოდის ავტომატური გამოძახება HTML-ში',
                'სტილის ავტომატური განახლება HTML და CSS შორის'
            ],
            correctAnswer: 1
        },
        {
            id: 5,
            question: 'როგორ შექმნათ პირველი პრაქტიკული კომპონენტი Angular CLI-ს საშუალებით?',
            options: [
                'ng generate component component-name',
                'ng new component component-name',
                'ng create component component-name',
                'ng add component component-name'
            ],
            correctAnswer: 0
        },
        {
            id: 6,
            question: 'რომელ დეკორატორს ვიყენებთ კომპონენტის განსაზღვრას Angular-ში?',
            options: [
                '@NgModule',
                '@Injectable',
                '@Component',
                '@Directive'
            ],
            correctAnswer: 2
        },
        {
            id: 7,
            question: 'რა ფუნქცია აქვს selector-ს @Component დეკორატორში?',
            options: [
                ' განსაზღვრავს კომპონენტის CSS ფაილს',
                ' განსაზღვრავს HTML ელემენტის სახელწოდებას, რომლითაც კომპონენტი გამოიძახებება',
                ' განსაზღვრავს TypeScript კლასის სახელწოდებას',
                ' განსაზღვრავს კომპონენტის Node.js პაკეტის ადგილმდებარეობას'
            ],
            correctAnswer: 1
        },
        {
            id: 8,
            question: 'რას ნიშნავს {{ title }} Angular-ის HTML-ში?',
            options: [
                'CSS სტილის ბმულს',
                'Class-ის ცვლადის მნიშვნელობის ჩვენებას HTML-ში (Interpolation)',
                'დეკორატორის ფუნქციის გამოძახებას',
                'ელემენტის click მოვლენის დაკავშირებას'
            ],
            correctAnswer: 1
        },
        {
            id: 9,
            question: 'რა ნიშნავს (click)="showTitle()" Angular-ის HTML-ში?',
            options: [
                'კლასის მეთოდის showTitle() ავტომატურ გამოძახებას კომპონენტის შექმნის დროს',
                'ელემენტის კლიკზე Class-ის showTitle() მეთოდის გამოძახებას (Event Binding)',
                'ტექსტის ავტომატურ ჩანაცვლებას HTML-ში',
                'HTML ელემენტის სტილის ცვლილებას'
            ],
            correctAnswer: 1
        },
        {
            id: 10,
            question: 'რომელი მეთოდი შექმნის კომპონენტის ცალკეულ სტილს SCSS ფაილში?',
            options: [
                'ng generate style component-name',
                'ng generate component component-name',
                'ng create scss component-name',
                'ng add scss component-name'
            ],
            correctAnswer: 1
        }
    ];

    currentQuestionIndex = 0;
    answers: Answer[] = [];
    showResults = false;
    storageKey = 'lecture2_answers';

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

