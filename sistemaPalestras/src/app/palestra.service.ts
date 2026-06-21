import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Palestra {
  id: number;
  titulo: string;
  descricao: string;
  nomePalestrante: string;
  localEvento: string;
  dataEvento: string;
}

@Injectable({
  providedIn: 'root'
})
export class PalestraApi {
  private apiUrl = "http://localhost:3000/api/palestras";

  constructor(private http: HttpClient) {}

  listarPalestra(): Observable<Palestra[]> {
    return this.http.get<Palestra[]>(this.apiUrl);
  }

  listarParticipantes(idPalestra: number): Observable<{ nome: string; email: string }[]> {
    return this.http.get<{ nome: string; email: string }[]>(`http://localhost:3000/api/palestras/${idPalestra}/participantes`);
  }

  listarInscricoesUsuario(idUsuario: number): Observable<number[]> {
    return this.http.get<number[]>(`http://localhost:3000/api/usuarios/${idUsuario}/inscricoes`);
  }

  cancelarInscricao(idUsuario: number, idPalestra: number): Observable<any> {
    return this.http.delete(`http://localhost:3000/api/inscricao`, {
      body: { idUsuario, idPalestra }
    });
  }
}
