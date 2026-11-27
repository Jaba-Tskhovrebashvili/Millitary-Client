import { Routes } from '@angular/router';
import { authGuard, guestGuard } from '@core/auth/auth.guards';

export const routes: Routes = [
  {
    path: 'sign-in',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/sign-in/sign-in.page').then(m => m.SignInPage),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage),
  },
  {
    path: 'sign-up',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/sign-up/sign-up.page').then(m => m.SignUpPage),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./core/layout/shell/shell.component').then(m => m.ShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'personnel' },
      {
        path: 'personnel',
        loadComponent: () =>
          import('./pages/personnel-list/personnel-list.page').then(m => m.PersonnelListPage),
      },
      {
        path: 'personnel/new',
        loadComponent: () =>
          import('./pages/personnel-form/personnel-form.page').then(m => m.PersonnelFormPage),
      },
      {
        path: 'personnel/:id/edit',
        loadComponent: () =>
          import('./pages/personnel-form/personnel-form.page').then(m => m.PersonnelFormPage),
      },
      {
        path: 'personnel/:id',
        loadComponent: () =>
          import('./pages/personnel-detail/personnel-detail.page').then(m => m.PersonnelDetailPage),
      },
      {
        path: 'military-units',
        loadComponent: () =>
          import('./pages/military-units/military-units.page').then(m => m.MilitaryUnitsPage),
      },
      {
        path: 'positions',
        loadComponent: () => import('./pages/positions/positions.page').then(m => m.PositionsPage),
      },
      {
        path: 'ranks',
        loadComponent: () => import('./pages/ranks/ranks.page').then(m => m.RanksPage),
      },
      {
        path: 'courses',
        loadComponent: () => import('./pages/courses/courses.page').then(m => m.CoursesPage),
      },
      {
        path: 'courses/new',
        loadComponent: () => import('./pages/courses-form/courses-form.page').then(m => m.CoursesFormPage)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
