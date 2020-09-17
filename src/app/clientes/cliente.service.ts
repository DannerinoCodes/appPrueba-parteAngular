import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { Cliente } from './cliente';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
// si no queremos el cast, import map from rxjs/operators
// y la respuesta de getClientes sería:
//
//return this.http.get(this.urlEndPoint).pipe(
//map( response => response as Cliente[]));

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })


  constructor(private http: HttpClient,
    private router: Router) { }

  getClientes(page:number): Observable<any> {
    return this.http.get<Cliente[]>(this.urlEndPoint + '/page/'+ page).pipe(
      tap((response:any)=>{
        (response.content as Cliente[]).forEach(cliente=>{
          console.log(cliente);
        });
      }),
      map( (response:any) => {
        ( response.content as Cliente[]).map(cliente =>{
          cliente.createAt=formatDate(cliente.createAt, 'EEE dd, MMMM-yyyy','en-US');
          return cliente;
        });
        return response;
      })
    );
  }

  create(cliente: Cliente): Observable<any> {
    return this.http.post<Cliente>(this.urlEndPoint, cliente, { headers: this.httpHeaders }).pipe(
      catchError(e => {

        if (e.status == 400) {
          return throwError(e);
        }
        Swal.fire(e.error.mensaje, e.error.error, "error");
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put(`${this.urlEndPoint}/${cliente.id}`, cliente, { headers: this.httpHeaders }).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }
        Swal.fire(e.error.mensaje, e.error.error, "error");
        return throwError(e);
      })
    );
  }


  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        Swal.fire(e.error.mensaje, e.error.error, "error");
        return throwError(e);
      })
    );
  }

  getCliente(id): Observable<Cliente> {

    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        Swal.fire("Error al editar", e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }
}
