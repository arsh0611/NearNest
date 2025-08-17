import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

       // Define the structure of a user
       interface User {
         username: string;
         email: string;
         password: string;
         memberSince: Date;
       }

@Injectable({ providedIn: 'root' })
export class AuthService {

  // Store users in localStorage (in a real app, this would be a database)
  private users: User[] = [];

           constructor(
            private http: HttpClient
           ) {
           // Load existing users from localStorage
           const savedUsers = localStorage.getItem('users');
           if (savedUsers) {
             this.users = JSON.parse(savedUsers);
             // Convert string dates back to Date objects
             this.users.forEach(user => {
               if (user.memberSince && typeof user.memberSince === 'string') {
                 user.memberSince = new Date(user.memberSince);
               }
             });
           }
         }
          private base = 'http://localhost:8081/api/auth';


          signup(username: string, email: string, password: string) {
            return this.http.post<{success: boolean, message: string}>(`${this.base}/signup`, {
              username, email, password
            });
          }

        //    signup2(username: string, email: string, password: string): boolean {
        //    // Check if username already exists
        //    const existingUser = this.users.find(user => user.username === username);
        //    if (existingUser) {
        //      return false; // Username already exists
        //    }

        //    // Create new user
        //    const newUser: User = {
        //      username,
        //      email,
        //      password, // In a real app, you'd hash this password!
        //      memberSince: new Date() // Add signup date
        //    };

        //    // Add to users array
        //    this.users.push(newUser);

        //    // Save to localStorage
        //    localStorage.setItem('users', JSON.stringify(this.users));

        //    return true; // Signup successful
        //  }
  //create a login2 function that calls api http://auth/login and accepts username and password
    
  // async login(username: string, password: string): Promise<boolean> {
  //   const params = new HttpParams()
  //     .set('username', username)
  //     .set('password', password);

  //   try {
  //     const response: string|undefined = await this.http.post(
  //       'http://localhost:8080/api/login',
  //       null,
  //       { params, responseType: 'text' }
  //     ).toPromise();

  //     if (response === 'Login Success') {
  //       localStorage.setItem('auth', 'true');
  //       localStorage.setItem('currentUser', username);
  //       return true;
  //     }
  //     return false;
  //   } catch (error: any) {
  //     console.error('Login failed:', error);
  //     return false;
  //   }
  // }

  async login(username: string, password: string): Promise<boolean> {
  try {
    const response = await firstValueFrom(
      this.http.post<{ success: boolean; message: string }>(
        'http://localhost:8081/api/auth/validate',
        { username, password } // send JSON body
      )
    );

    if (response.success) {
      localStorage.setItem('auth', 'true');
      localStorage.setItem('currentUser', username);
      return true;
    }
    return false;
  } catch (error: any) {
    console.error('Login failed:', error);
    return false;
  }
}


  login2(username: string, password: string): boolean {
    // Find user by username
    const user = this.users.find(u => u.username === username);
    
    if (user && user.password === password) {
      localStorage.setItem('auth', 'true');
      localStorage.setItem('currentUser', username);
      return true;
    }
    return false;
  }
//create a logout function
  logout() {
    localStorage.removeItem('auth');
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('auth') === 'true';
  }

           getCurrentUser(): string | null {
           return localStorage.getItem('currentUser');
         }

         getCurrentUserData(): User | null {
           const username = this.getCurrentUser();
           if (username) {
             return this.users.find(user => user.username === username) || null;
           }
           return null;
         }
}
