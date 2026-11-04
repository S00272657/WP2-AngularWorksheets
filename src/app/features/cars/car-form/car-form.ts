import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Car } from '../models/car.model';
import { CarService } from '../services/car.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-car-form',
  imports: [ReactiveFormsModule],
  templateUrl: './car-form.html',
  styleUrl: './car-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly carService = inject(CarService);
  private readonly router = inject(Router)

  carForm = this.formBuilder.nonNullable.group({
    make: ['', Validators.required],
    model: ['', Validators.required],
    year: new FormControl<number | null>(null),
  });

  onSubmit(): void {
    if (this.carForm.invalid) {
      this.carForm.markAllAsTouched();
      return;
    }

    const { make, model, year } = this.carForm.getRawValue();
    const carData: Car = {
      make,
      model,
      ...(year !== null ? { year } : {}),
    };

    this.carService.addCar(carData).subscribe({
      next: (response: Car) => {
        console.log('Car added successfully:', response);
        this.router.navigate(['/cars']); 
      },
      error: (error: unknown) => {
        console.error('Error adding car:', error);
      },
    });
  }
}
