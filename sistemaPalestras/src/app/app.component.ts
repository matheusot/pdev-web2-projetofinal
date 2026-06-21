import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { Auth } from './auth.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

interface UserData {
  id: number;
  email: string;
  nome: string;
  admin: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App implements OnInit {
  protected readonly title = signal('Sistema Palestras');
  userData: UserData | null = null;
  logado: boolean = false;
  exibirMenuUsuario: boolean = false;
  currentUrl: string = '';

  constructor(private router: Router, private authService: Auth) {}

  ngOnInit(): void {
    this.logado = this.authService.isLoggedIn();
    this.userData = this.authService.getUser();
    this.exibirMenuUsuario = false;
    this.currentUrl = this.router.url;
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.logado = this.authService.isLoggedIn();
        this.userData = this.authService.getUser();
        this.exibirMenuUsuario = false;
        this.currentUrl = this.router.url;
      });
  }

  toggleMenuUsuario(event: Event): void {
    event.preventDefault();
    this.exibirMenuUsuario = !this.exibirMenuUsuario;
  }

  logout(): void {
    this.authService.logout();
    this.logado = false;
    this.userData = null;
    this.exibirMenuUsuario = false;
  }
}
