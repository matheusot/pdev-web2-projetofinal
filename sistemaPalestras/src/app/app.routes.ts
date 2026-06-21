import { Routes } from '@angular/router';
import { Cadastro } from './cadastro/cadastro.component';
import { Login } from './login/login.component';
import { Home } from './home/home.component';
import { CadastrarEvento } from './cadastrar-evento/cadastrar-evento.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'cadastro', component: Cadastro },
  { path: 'login', component: Login },
  { path: 'admin', component: CadastrarEvento },
  { path: '**', redirectTo: 'home' }
];
