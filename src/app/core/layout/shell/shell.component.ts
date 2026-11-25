import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthTokenService } from '@core/auth/auth-token.service';

interface NavItem {
  path: string;
  label: string;
}

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  private readonly tokens = inject(AuthTokenService);
  private readonly router = inject(Router);

  protected readonly menuOpen = signal(false);

  protected readonly nav: NavItem[] = [
    { path: '/personnel', label: 'პირადი შემადგენლობა' },
    { path: '/military-units', label: 'სამხედრო ნაწილები' },
    { path: '/positions', label: 'თანამდებობები' },
    { path: '/ranks', label: 'წოდებები' },
    { path: '/courses', label: 'კურსები' },
  ];

  protected toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected logout(): void {
    this.tokens.clear();
    void this.router.navigate(['/sign-in']);
  }
}
