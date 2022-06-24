//Copiado de articulos service
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Libro } from '../models/libro';

@Injectable({
  providedIn: 'root',
})
export class LibrosService {
  resourceUrl: string;
  constructor(private httpClient: HttpClient) {
    //this.resourceUrl = environment.ConexionWebApiProxy + 'Libros/';
    this.resourceUrl = 'https://pav2.azurewebsites.net/api/libros/';
  }

  get(Titulo: string) {
    let params = new HttpParams();
    if (Titulo != null) {
      params = params.append('Titulo', Titulo);
    }
    return this.httpClient.get(this.resourceUrl, { params: params });
  }
  getAll() {
    return this.httpClient.get(this.resourceUrl);
  }

  getById(Id: number) {
    return this.httpClient.get(this.resourceUrl + Id);
  }

  post(obj: Libro) {
    return this.httpClient.post(this.resourceUrl, obj);
  }

  put(Id: number, obj: Libro) {
    return this.httpClient.put(this.resourceUrl + Id, obj);
  }

  delete(Id) {
    return this.httpClient.delete(this.resourceUrl + Id);
  }
}
