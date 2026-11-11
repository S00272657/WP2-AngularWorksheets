import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarService } from '../services/car.service';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { CreateCarDto } from '../models/car.model';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { input } from '@angular/core';

@Component({
  selector: 'app-car-form',
  imports: [
    ReactiveFormsModule, 
    RouterLink, 
    MatButtonModule, 
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatProgressBarModule
],
  templateUrl: './car-form.html',
  styleUrl: './car-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarForm implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly carService = inject(CarService);
  private readonly router = inject(Router)
  private snackBar = inject(MatSnackBar);

  readonly currentYear = new Date().getFullYear();
  readonly id = input<string>();  // note this is optional by default

  carForm = this.formBuilder.nonNullable.group({
    make: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
    model: ['', [Validators.required, Validators.maxLength(30)]],
    year: this.formBuilder.control<number | null>(null, [Validators.min(1950), Validators.max(this.currentYear + 1),]),
  });

  saving = signal(false);
  saveError = signal<string | null>(null);


  ngOnInit(): void {
    const id = this.id();
    if (!id) return; // adding a new car, nothing to load

    this.carService.getCarById(id).subscribe({
      next: (car) =>
        this.carForm.patchValue({ make: car.make, model: car.model, year: car.year ?? null }),
      error: (err: Error) => this.saveError.set(err.message),
    });
  }


  onSubmit(): void {
    this.carForm.disable()

    const { make, model, year } = this.carForm.getRawValue();
    const newCar: CreateCarDto = { make, model, year: year ?? undefined };

    this.saving.set(true);
    this.saveError.set(null);


    const id = this.id();

    const request = id // var ehich is the type of request we'll use
      ? this.carService.updateCar(id, newCar)
      : this.carService.addCar(newCar);

    request.subscribe({
      next: (response) => {
        this.snackBar.open(`${newCar.make} ${newCar.model} saved`, 'Close', { duration: 10000 });
        console.log('Car added successfully:', response);
        this.router.navigate(['/cars']);
      },
    error: (err: Error) => {
      this.saveError.set(err.message);
      this.saving.set(false);
      this.carForm.enable()
    },
    });
  }

}
