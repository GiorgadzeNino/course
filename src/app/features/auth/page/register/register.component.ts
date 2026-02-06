import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent {
    registerForm: FormGroup;
    isSubmitting = false;
    showSuccess = false;
    showError = false;
    errorMessage = '';

    constructor(
        private fb: FormBuilder,
        private http: HttpClient
    ) {
        this.registerForm = this.fb.group({
            name: ['', [Validators.required]],
            lastname: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required]]
        });
    }

    onSubmit() {
        if (this.registerForm.valid && !this.isSubmitting) {
            this.isSubmitting = true;
            this.showSuccess = false;
            this.showError = false;

            const formData = { ...this.registerForm.value, course: [] };

            // this.http.post('https://formspree.io/f/mkovwllj', formData, {
            //     headers: { 'Accept': 'application/json' }
            // })
            //     .subscribe({
            //         next: (res) => {
            //             console.log(res);
            //             this.showSuccess = true;
            //             this.isSubmitting = false;
            //             this.registerForm.reset();
            //             // Hide success message after 5 seconds
            //             setTimeout(() => {
            //                 this.showSuccess = false;
            //             }, 5000);
            //         },
            //         error: (error) => {
            //             this.showError = true;
            //             this.isSubmitting = false;
            //             this.errorMessage = error.error?.error || 'დაფიქსირდა შეცდომა. გთხოვთ სცადოთ მოგვიანებით.';
            //             // Hide error message after 5 seconds
            //             setTimeout(() => {
            //                 this.showError = false;
            //             }, 5000);
            //         }
            //     });
        } else {
            this.registerForm.markAllAsTouched();
        }
    }

    get name() {
        return this.registerForm.get('name');
    }

    get lastname() {
        return this.registerForm.get('lastname');
    }

    get email() {
        return this.registerForm.get('email');
    }

    get phone() {
        return this.registerForm.get('phone');
    }
}

