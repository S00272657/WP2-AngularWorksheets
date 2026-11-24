import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { input } from '@angular/core';
import { notBlank } from '../../../../shared/validators/not-blank.validator';
import { RegisterUserDto } from '../../../../core/models/user';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule, 
    RouterLink, 
    MatButtonModule, 
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatProgressBarModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  private readonly formBuilder = inject(FormBuilder);
  //private readonly carService = inject(CarService);
  private readonly router = inject(Router)
  private snackBar = inject(MatSnackBar);

  readonly currentYear = new Date().getFullYear();
  readonly id = input<string>();  // note this is optional by default

  registerForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(1), notBlank]],
    email: ['', [Validators.required, Validators.email, notBlank]],
    password: ['', [Validators.min(6), Validators.max(64),  ]],
  });

  saving = signal(false);
  saveError = signal<string | null>(null);

  onSubmit(): void {
    this.registerForm.disable()

    const { name, email, password } = this.registerForm.getRawValue();
    const newUser: RegisterUserDto = { name, email, password };

    this.saving.set(true);
    this.saveError.set(null);
  }


}
