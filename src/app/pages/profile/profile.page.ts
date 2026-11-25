import { Component, inject } from '@angular/core';
import { ProfileApi } from './profile.api';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile-page',
  providers: [ProfileService, ProfileApi],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.scss',
})
export class ProfilePage {
  protected readonly page = inject(ProfileService);

  constructor() {
    this.page.load();
  }
}
