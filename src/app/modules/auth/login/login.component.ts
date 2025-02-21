import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/authservice/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  authForm!: FormGroup;
  isSignUp = false;


  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    if (this.isSignUp) {
      this.authForm = this.fb.group({
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        rememberMe: [false]
      }, { validators: this.passwordMatchValidator });
    } else {
      this.authForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        rememberMe: [false]
      });
    }
  }



  private passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!confirmPassword) return null;

    return password === confirmPassword ? null : { mismatch: true };
  };

  toggleForm(signUp: boolean): void {
    this.isSignUp = signUp;
    this.authForm.reset();
    this.initForm();
  }

  onSubmit(): void {
    if (this.authForm.valid) {
      if (this.isSignUp) {
        this.authService.register({
          username: this.authForm.value.username,
          email: this.authForm.value.email,
          password: this.authForm.value.password
        }).subscribe({
          next: (response) => {
            console.log('Signup successful', response);
            this.authForm.reset();
          },
          error: (error) => {
            console.error('Signup failed', error);
          }
        });
      } else {
        this.authService.login({
          email: this.authForm.value.email,
          password: this.authForm.value.password,
          rememberMe: this.authForm.value.rememberMe
        }).subscribe({
          next: (response) => {
            console.log('Login successful', response);
            if (this.authForm.value.rememberMe)
              {
              localStorage.setItem('token', response.token);
              sessionStorage.removeItem('token');
            }
            else
              {
                sessionStorage.setItem('token', response.token);
                localStorage.removeItem('token');
              }
              this.router.navigate(['/home/add-product']);
          },
          error: (error) => {
            console.error('Login failed', error);
          }
        });
      }
    }
  }
}
