import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {Car} from '../models/car.model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class CarService {

private http = inject(HttpClient);

private apiUrl = 'http://localhost:3000/api/v1/cars'; // this should be read from an env variable we will leave it for now.

  getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(this.apiUrl)
  }

  getCarById(id: string): Observable<Car> {
    return this.http.get<Car>(`${this.apiUrl}/${id}`);
  }

}
