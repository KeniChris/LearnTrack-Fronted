import { Component, signal, inject, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

const COURSES = [
  'Introducción a los algoritmos',
  'Algoritmos',
  'Algoritmos y estructura de datos',
  'Complejidad algorítmica',
  'IHC y programación web',
  'Programación orientada a objetos',
  'Base de datos',
  'Desarrollo web',
];

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private auth = inject(AuthService);
  private router = inject(Router);

  step = signal(1);

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';

  firstNameError = signal('');
  lastNameError = signal('');
  emailError = signal('');
  passwordError = signal('');
  confirmError = signal('');
  backendError = signal('');

  selectedCourses = signal<string[]>([]);
  readonly courses = COURSES;

  codeDigits = ['', '', '', ''];
  codeError = signal('');

  loading = signal(false);

  @ViewChildren('digitInput') digitInputs!: QueryList<ElementRef<HTMLInputElement>>;

  toggleCourse(course: string): void {
    this.selectedCourses.update(list =>
      list.includes(course) ? list.filter(c => c !== course) : [...list, course]
    );
  }

  step1Continue(): void {
    this.firstNameError.set('');
    this.lastNameError.set('');
    this.emailError.set('');
    this.passwordError.set('');
    this.confirmError.set('');

    let ok = true;
    if (!this.firstName.trim()) { this.firstNameError.set('Campo obligatorio'); ok = false; }
    if (!this.lastName.trim()) { this.lastNameError.set('Campo obligatorio'); ok = false; }
    if (!this.email.trim()) {
      this.emailError.set('Campo obligatorio'); ok = false;
    } else if (!this.email.toLowerCase().endsWith('@upc.edu.pe')) {
      this.emailError.set('Debe ser un correo @upc.edu.pe'); ok = false;
    }
    if (!this.password) {
      this.passwordError.set('Campo obligatorio'); ok = false;
    } else if (this.password.length < 6) {
      this.passwordError.set('Mínimo 6 caracteres'); ok = false;
    }
    if (!this.confirmPassword) {
      this.confirmError.set('Campo obligatorio'); ok = false;
    } else if (this.password !== this.confirmPassword) {
      this.confirmError.set('Las contraseñas no coinciden'); ok = false;
    }

    if (ok) this.step.set(2);
  }

  step2Continue(): void {
    this.backendError.set('');
    this.loading.set(true);
    this.auth.register({
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      email: this.email.trim().toLowerCase(),
      password: this.password,
      roleName: 'DOCENTE',
    }).subscribe({
      next: () => { this.loading.set(false); this.step.set(3); },
      error: (e: { error?: { message?: string } }) => {
        this.backendError.set(e?.error?.message || 'Error al registrar. Intenta nuevamente.');
        this.loading.set(false);
      },
    });
  }

  onDigitInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const val = input.value.replace(/\D/g, '').slice(-1);
    input.value = val;
    this.codeDigits[index] = val;
    if (val && index < 3) {
      const next = this.digitInputs.toArray()[index + 1];
      next?.nativeElement.focus();
    }
  }

  onDigitKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.codeDigits[index] && index > 0) {
      this.codeDigits[index - 1] = '';
      const prev = this.digitInputs.toArray()[index - 1];
      if (prev) { prev.nativeElement.value = ''; prev.nativeElement.focus(); }
    }
  }

  submitCode(): void {
    this.codeError.set('');
    if (this.codeDigits.some(d => !d)) {
      this.codeError.set('Ingresa los 4 dígitos');
      return;
    }
    this.step.set(4);
  }

  goLogin(): void {
    this.router.navigate(['/login']);
  }
}
