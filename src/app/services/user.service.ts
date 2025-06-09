import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  usuario: string;
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  nombres: string;
  apellidos: string;
  departamento: string;
  cargo: string;
  email: string;
  idDepartamento?: number | null;
  idCargo?: number | null;
}

export interface RawUser {
  id: number;
  usuario: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  email?: string;
  idDepartamento?: number;
  idCargo?: number;
  departamento?: {
    id: number;
    nombre: string;
  };
  cargo?: {
    id: number;
    nombre: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getUsers(
    page: number,
    size: number,
    filters?: { idDepartamento?: number; idCargo?: number }
  ): Observable<{ data: RawUser[]; total: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters?.idDepartamento) {
      params = params.set('idDepartamento', filters.idDepartamento.toString());
    }

    if (filters?.idCargo) {
      params = params.set('idCargo', filters.idCargo.toString());
    }

    return this.http.get<{ data: RawUser[]; total: number }>(this.apiUrl, { params });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  createUser(userData: any): Observable<any> {
    return this.http.post(this.apiUrl, userData);
  }

  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, userData);
  }
}
