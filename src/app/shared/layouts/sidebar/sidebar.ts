import { Component, inject, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private auth = inject(AuthService);
  private router = inject(Router);

  initials = computed(() => {
    const u = this.auth.getUser();
    if (u?.name) return u.name.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();
    if (u?.email) return u.email.slice(0, 2).toUpperCase();
    return 'DR';
  });

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
