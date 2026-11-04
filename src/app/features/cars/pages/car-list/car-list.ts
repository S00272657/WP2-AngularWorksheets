import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { CarService } from '../../services/car.service';
import { Car } from '../../models/car.model';
import { AsyncPipe } from '@angular/common';
import { CarCard } from '../../car-card/car-card';

@Component({
  selector: 'app-car-list',
  imports: [AsyncPipe, CarCard ],
  templateUrl: './car-list.html',
  styleUrl: './car-list.scss',
})

export class CarList implements OnInit {

private carService = inject(CarService);
  
  cars$!: Observable<Car[]>;

  ngOnInit(): void {
    this.cars$ = this.carService.getCars();
  }
}

