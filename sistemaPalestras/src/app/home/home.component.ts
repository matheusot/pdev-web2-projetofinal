import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Auth } from '../auth.service';
import { PalestraApi, Palestra } from '../palestra.service';

interface UserData {
  id: number;
  email: string;
  nome: string;
  admin: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class Home implements OnInit {
  userData: UserData | null = null;
  palestras: Palestra[] = [];
  inscricoesUsuario: number[] = [];

  palestraSelecionada: Palestra | null = null;
  participantesPalestraSelecionada: { nome: string; email: string }[] = [];
  carregandoModal: boolean = false;

  mensagemSucesso: string | null = null;
  mensagemErro: string | null = null;

  exibirSucesso(msg: string): void {
    this.mensagemSucesso = msg;
    this.mensagemErro = null;
    this.cd.detectChanges();
    setTimeout(() => {
      this.mensagemSucesso = null;
      this.cd.detectChanges();
    }, 4000);
  }

  exibirErro(msg: string): void {
    this.mensagemErro = msg;
    this.mensagemSucesso = null;
    this.cd.detectChanges();
    setTimeout(() => {
      this.mensagemErro = null;
      this.cd.detectChanges();
    }, 4000);
  }

  constructor(
    private authService: Auth,
    private router: Router,
    private palestraApi: PalestraApi,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userData = this.authService.getUser();
    if (!this.userData) {
      this.router.navigateByUrl("/login");
      return;
    }

    this.palestraApi.listarPalestra().subscribe({
      next: (dados) => {
        this.palestras = dados;
        this.cd.detectChanges();
      },
      error: (err) => console.log("Erro ao carregar dados", err),
    });

    if (this.userData && !this.userData.admin) {
      this.palestraApi.listarInscricoesUsuario(this.userData.id).subscribe({
        next: (ids) => {
          this.inscricoesUsuario = ids;
          this.cd.detectChanges();
        },
        error: (err) => console.error("Erro ao buscar inscrições do usuário:", err)
      });
    }
  }

  inscricao(idPalestra: number): void {
    const idUsuario = this.userData?.id;
    if (!idUsuario) return;

    this.http.post<any>("http://localhost:3000/api/inscricao", {
      idUsuario,
      idPalestra
    }).subscribe({
      next: (res) => {
        this.exibirSucesso(res.message);
        this.inscricoesUsuario.push(idPalestra);
        this.cd.detectChanges();
      },
      error: (err) => {
        this.exibirErro(err.error.message || "Erro ao realizar inscrição");
      }
    });
  }

  abrirModalParticipantes(palestra: Palestra): void {
    this.palestraSelecionada = palestra;
    this.participantesPalestraSelecionada = [];
    this.carregandoModal = true;
    this.cd.detectChanges();

    this.palestraApi.listarParticipantes(palestra.id).subscribe({
      next: (dados) => {
        this.participantesPalestraSelecionada = dados;
        this.carregandoModal = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error("Erro ao carregar participantes", err);
        this.carregandoModal = false;
        this.cd.detectChanges();
      }
    });
  }

  fecharModal(): void {
    this.palestraSelecionada = null;
    this.participantesPalestraSelecionada = [];
    this.carregandoModal = false;
    this.cd.detectChanges();
  }

  desinscricao(idPalestra: number): void {
    const idUsuario = this.userData?.id;
    if (!idUsuario) return;

    this.palestraApi.cancelarInscricao(idUsuario, idPalestra).subscribe({
      next: (res) => {
        this.exibirSucesso(res.message);
        this.inscricoesUsuario = this.inscricoesUsuario.filter(id => id !== idPalestra);
        this.cd.detectChanges();
      },
      error: (err) => {
        this.exibirErro(err.error?.message || "Erro ao cancelar inscrição");
      }
    });
  }

  estaInscrito(idPalestra: number): boolean {
    return this.inscricoesUsuario.includes(idPalestra);
  }
}
