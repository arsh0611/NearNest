import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="signup-container">
      <div class="signup-form">
        <h2>Create Account</h2>
        <form (ngSubmit)="onSignup()" #signupForm="ngForm">
          <div class="form-group">
            <input [(ngModel)]="username" name="username" placeholder="Username" required #usernameField="ngModel" />
            <div class="error-message" *ngIf="usernameField.invalid && usernameField.touched">Username is required</div>
          </div>
          <div class="form-group">
            <input [(ngModel)]="email" name="email" type="email" placeholder="Email" required #emailField="ngModel" />
            <div class="error-message" *ngIf="emailField.invalid && emailField.touched">Please enter a valid email</div>
          </div>
          <div class="form-group">
            <input [(ngModel)]="password" name="password" type="password" placeholder="Password" required minlength="6" #passwordField="ngModel" />
            <div class="error-message" *ngIf="passwordField.invalid && passwordField.touched">Password must be at least 6 characters</div>
          </div>
          <div class="form-group">
            <input [(ngModel)]="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm Password" required #confirmPasswordField="ngModel" />
            <div class="error-message" *ngIf="confirmPasswordField.invalid && confirmPasswordField.touched">Please confirm your password</div>
          </div>
          <button type="submit" [disabled]="signupForm.invalid">Create Account</button>
        </form>
        <div class="login-link">Already have an account? <a routerLink="/login">Login here</a></div>
        <div class="message error" *ngIf="signupError">{{ signupError }}</div>
        <div class="message success" *ngIf="signupSuccess">Account created successfully! Redirecting to login...</div>
      </div>
    </div>
  `,
  styles: [`
    .signup-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; }
    .signup-form { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
    h2 { text-align: center; color: #333; margin-bottom: 30px; font-size: 28px; font-weight: 600; }
    .form-group { margin-bottom: 20px; }
    input { width: 100%; padding: 12px 15px; border: 2px solid #e1e5e9; border-radius: 8px; font-size: 16px; transition: border-color 0.3s ease; box-sizing: border-box; }
    input:focus { outline: none; border-color: #667eea; }
    input::placeholder { color: #999; }
    .error-message { color: #e74c3c; font-size: 14px; margin-top: 5px; display: block; }
    button { width: 100%; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: transform 0.2s ease; }
    button:hover:not(:disabled) { transform: translateY(-2px); }
    button:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    .login-link { text-align: center; margin-top: 20px; color: #666; }
    .login-link a { color: #667eea; text-decoration: none; font-weight: 600; }
    .login-link a:hover { text-decoration: underline; }
    .message { margin-top: 15px; padding: 10px; border-radius: 5px; text-align: center; font-weight: 500; }
    .message.error { background-color: #fee; color: #e74c3c; border: 1px solid #fcc; }
    .message.success { background-color: #efe; color: #27ae60; border: 1px solid #cfc; }
  `]
})
export class SignupComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  signupError = '';
  signupSuccess = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSignup() {
    // Reset error messages
    this.signupError = '';
    
    // Validate passwords match
    if (this.password !== this.confirmPassword) {
      this.signupError = 'Passwords do not match';
      return;
    }
    
    // Validate password length
    if (this.password.length < 6) {
      this.signupError = 'Password must be at least 6 characters long';
      return;
    }
    
    // Try to create account
    const success = this.auth.signup(this.username, this.email, this.password);
    if (success) {
      this.signupSuccess = true;
      // Redirect to login after 2 seconds
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } else {
      this.signupError = 'Username or email already exists';
    }
  }
} 