import { Injectable } from '@angular/core';

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Answer {
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
}

@Injectable()
export class QuestionsService {
  
  initializeQuiz(questions: Question[], storageKey: string): {
    currentQuestionIndex: number;
    answers: Answer[];
    showResults: boolean;
  } {
    const saved = localStorage.getItem(storageKey);
    let answers: Answer[] = [];
    let currentQuestionIndex = 0;
    let showResults = false;

    if (saved) {
      answers = JSON.parse(saved);
      // Find first unanswered question
      const unansweredIndex = questions.findIndex(
        q => !answers.find(a => a.questionId === q.id)
      );
      if (unansweredIndex !== -1) {
        currentQuestionIndex = unansweredIndex;
      } else {
        showResults = true;
      }
    }

    return { currentQuestionIndex, answers, showResults };
  }

  getCurrentQuestion(questions: Question[], currentQuestionIndex: number): Question {
    return questions[currentQuestionIndex];
  }

  getCurrentAnswer(answers: Answer[], questionId: number): Answer | undefined {
    return answers.find(a => a.questionId === questionId);
  }

  isAnswered(answers: Answer[], questionId: number): boolean {
    return this.getCurrentAnswer(answers, questionId) !== undefined;
  }

  isCorrect(answers: Answer[], questionId: number): boolean {
    const answer = this.getCurrentAnswer(answers, questionId);
    return answer?.isCorrect ?? false;
  }

  calculateProgress(answers: Answer[], totalQuestions: number): number {
    return ((answers.length / totalQuestions) * 100);
  }

  selectAnswer(
    question: Question,
    optionIndex: number,
    answers: Answer[],
    storageKey: string
  ): Answer {
    const isCorrect = optionIndex === question.correctAnswer;
    const answer: Answer = {
      questionId: question.id,
      selectedAnswer: optionIndex,
      isCorrect
    };

    // Check if answer already exists and update it, otherwise add it
    const existingIndex = answers.findIndex(a => a.questionId === question.id);
    if (existingIndex !== -1) {
      answers[existingIndex] = answer;
    } else {
      answers.push(answer);
    }

    this.saveAnswers(answers, storageKey);
    return answer;
  }

  getQuestionStatus(answers: Answer[], questionId: number): 'correct' | 'incorrect' | 'unanswered' {
    const answer = answers.find(a => a.questionId === questionId);
    if (!answer) return 'unanswered';
    return answer.isCorrect ? 'correct' : 'incorrect';
  }

  getTotalScore(answers: Answer[]): number {
    return answers.filter(a => a.isCorrect).length;
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  getSelectedAnswer(answers: Answer[], questionId: number): number {
    const answer = answers.find(a => a.questionId === questionId);
    return answer?.selectedAnswer ?? -1;
  }

  getSelectedOptionText(question: Question, answers: Answer[]): string {
    const selectedIndex = this.getSelectedAnswer(answers, question.id);
    if (selectedIndex === -1) return '';
    return question.options[selectedIndex];
  }

  getCorrectOptionText(question: Question): string {
    return question.options[question.correctAnswer];
  }

  resetQuiz(storageKey: string): void {
    localStorage.removeItem(storageKey);
  }

  saveAnswers(answers: Answer[], storageKey: string): void {
    localStorage.setItem(storageKey, JSON.stringify(answers));
  }

  loadAnswers(storageKey: string): Answer[] {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  }
}

