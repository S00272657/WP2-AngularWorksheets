import { Component, inject, input, signal } from '@angular/core';
import { Car } from '../models/car.model';
import { CarService } from '../services/car.service';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { LoadState, withLoadState } from '../../../shared/load-state';
import { RouterLink, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthCustomService } from '../../../core/auth/auth-custom.service';


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
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthCustomService);
  isAuthenicated = this.authService.isAuthenticated;



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
        this.openErrorSnackBar(err.message)
        this.deleting.set(false);
      },
    });
  }

  private openErrorSnackBar(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 5000,               // how long the snackbar stays visible (ms)
      panelClass: ['error-snackbar'] // define this class in styles.scss
    });
  }



}


