import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { FeedComponent } from './pages/feed/feed.component';
import { SearchComponent } from './pages/search/search.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { EventsComponent } from './pages/events/events.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
           {
           path: 'dashboard',
           component: DashboardComponent,
           canActivate: [AuthGuard],
           children: [
             { path: '', redirectTo: 'feed', pathMatch: 'full' },
             { path: 'feed', component: FeedComponent },
             { path: 'events', component: EventsComponent },
             { path: 'search', component: SearchComponent },
             { path: 'profile', component: ProfileComponent }
           ]
         }
];
