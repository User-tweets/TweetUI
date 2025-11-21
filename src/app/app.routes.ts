import { Routes } from '@angular/router';
import {Login} from './components/login/login';
import {Register} from './components/register/register';
import {Home} from './components/home/home';
import {authGuard} from './auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: Login,
    pathMatch: 'full',
  },
  {
    path: 'register',
    component: Register,
    pathMatch: 'full',
  },
  // {
  //   path: 'forgot',
  //   component: ForgotComponent,
  //   pathMatch: 'full',
  // },
  {
    path: 'home',
    component: Home,
    pathMatch: 'full',
    canActivate: [authGuard],
  },
  // {
  //   path: 'show-users',
  //   component: ShowUserComponent,
  //   pathMatch: 'full',
  //   canActivate: [authGuard],
  // },
  // {
  //   path: 'show-users/:username',
  //   component: ShowUserTweetsComponent,
  //   pathMatch: 'full',
  //   canActivate: [authGuard],
  // },
  // {
  //   path: 'postTweet',
  //   component: PostTweetComponent,
  //   pathMatch: 'full',
  //   canActivate: [authGuard],
  // }
];
