import { Component, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Auth } from '../auth.service';

interface respostaLogin {
  message: string;
  tipoMensagem: string;
  userData: {
    id: number;
    email: string;
    nome: string;
    admin: boolean;
  };
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class Login {
  formularioLogin = new FormGroup({
    email: new FormControl('', Validators.required),
    senha: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]),
  });

  mensagem: string = '';
  tipoMensagem: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: Auth
  ) {}

  onSubmit() {
    if (this.formularioLogin.valid) {
      this.http
        .post<respostaLogin>(
          'http://localhost:3000/api/login',
          this.formularioLogin.value
        )
        .subscribe({
          next: (res) => {
            this.tipoMensagem = res.tipoMensagem || 'success';
            this.mensagem = res.message || 'Login realizado com sucesso!';
            this.cdr.detectChanges();

            if (res.tipoMensagem === 'success') {
              this.authService.login(res.userData);
              setTimeout(() => {
                this.router.navigateByUrl('/home');
              }, 1000);
            }
          },
          error: (err) => {
            this.tipoMensagem = err.error?.tipoMensagem || 'danger';
            this.mensagem = err.error?.message || 'Usuário ou senha inválidos';
            this.cdr.detectChanges();
          },
        });
    }
  }
}
