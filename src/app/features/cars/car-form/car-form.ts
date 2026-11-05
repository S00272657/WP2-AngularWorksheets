import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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

@Component({
  selector: 'app-car-form',
  imports: [
    ReactiveFormsModule, 
    RouterLink, 
    MatButtonModule, 
    MatFormFieldModule,
    MatInputModule,
    MatCardModule
],
  templateUrl: './car-form.html',
  styleUrl: './car-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly carService = inject(CarService);
  private readonly router = inject(Router)

  readonly currentYear = new Date().getFullYear();

  carForm = this.formBuilder.nonNullable.group({
    make: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
    model: ['', [Validators.required, Validators.maxLength(30)]],
    year: this.formBuilder.control<number | null>(null, [Validators.min(1950), Validators.max(this.currentYear + 1),]),
  });

  saving = signal(false);
  saveError = signal<string | null>(null);


  onSubmit(): void {

    const { make, model, year } = this.carForm.getRawValue();
    const newCar: CreateCarDto = { make, model, year: year ?? undefined };

    this.saving.set(true);
    this.saveError.set(null);

    this.carService.addCar(newCar).subscribe({
      next: (response) => {
        console.log('Car added successfully:', response);
        this.router.navigate(['/cars']);
      },
    error: (err: Error) => {
      this.saveError.set(err.message);
      this.saving.set(false);
    },
    });
  }

}
