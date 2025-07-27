import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-form">
        <h2>Welcome Back</h2>
        <form (ngSubmit)="onLogin()" #loginForm="ngForm">
          <div class="form-group">
            <input [(ngModel)]="username" name="username" placeholder="Username" required #usernameField="ngModel" />
            <div class="error-message" *ngIf="usernameField.invalid && usernameField.touched">Username is required</div>
          </div>
          <div class="form-group">
            <input [(ngModel)]="password" name="password" type="password" placeholder="Password" required #passwordField="ngModel" />
            <div class="error-message" *ngIf="passwordField.invalid && passwordField.touched">Password is required</div>
          </div>
          <button type="submit" [disabled]="loginForm.invalid">Login</button>
        </form>
        <div class="signup-link">Don't have an account? <a routerLink="/signup">Sign up here</a></div>
        <div class="message error" *ngIf="loginError">Invalid username or password</div>
      </div>
    </div>
  `,
  styles: [`
    .login-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; }
    .login-form { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
    h2 { text-align: center; color: #333; margin-bottom: 30px; font-size: 28px; font-weight: 600; }
    .form-group { margin-bottom: 20px; }
    input { width: 100%; padding: 12px 15px; border: 2px solid #e1e5e9; border-radius: 8px; font-size: 16px; transition: border-color 0.3s ease; box-sizing: border-box; }
    input:focus { outline: none; border-color: #667eea; }
    input::placeholder { color: #999; }
    .error-message { color: #e74c3c; font-size: 14px; margin-top: 5px; display: block; }
    button { width: 100%; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: transform 0.2s ease; }
    button:hover:not(:disabled) { transform: translateY(-2px); }
    button:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    .signup-link { text-align: center; margin-top: 20px; color: #666; }
    .signup-link a { color: #667eea; text-decoration: none; font-weight: 600; }
    .signup-link a:hover { text-decoration: underline; }
    .message { margin-top: 15px; padding: 10px; border-radius: 5px; text-align: center; font-weight: 500; }
    .message.error { background-color: #fee; color: #e74c3c; border: 1px solid #fcc; }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  loginError = false;

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    const success = this.auth.login(this.username, this.password);
    if (success) {
      this.router.navigate(['/dashboard']);
    } else {
      this.loginError = true;
    }
  }
}
