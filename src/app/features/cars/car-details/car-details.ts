import { Component, inject, input, signal } from '@angular/core';
import { Car } from '../models/car.model';
import { CarService } from '../services/car.service';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { LoadState, withLoadState } from '../../../shared/load-state';
import { RouterLink, Router } from '@angular/router';


@Component({
  selector: 'app-car-details',
  imports: [RouterLink],
  templateUrl: './car-details.html',
  styleUrl: './car-details.scss',
})
export class CarDetails {

  private carService = inject(CarService);

  readonly id = input.required<string>();

  readonly initial: LoadState<Car> = { status: 'loading' };

  private readonly router = inject(Router);

  readonly deleting = signal(false);
  
  readonly deleteError = signal<string | null>(null);


  state = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) => withLoadState(this.carService.getCarById(id))),
    ),
    { initialValue: this.initial },
  );


  deleteCar(car: Car): void {
  if (!confirm(`Delete ${car.make} ${car.model}?`)) return;

  this.deleting.set(true);
  this.deleteError.set(null);

  this.carService.deleteCar(this.id()).subscribe({
    next: () => this.router.navigate(['/cars']),
    error: (err: Error) => {
      this.deleteError.set(err.message);
      this.deleting.set(false);
    },
  });
}



}


