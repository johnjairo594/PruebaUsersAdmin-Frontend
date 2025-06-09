import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CatalogService } from '@app/services/catalog.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-user-form-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule
  ],
  templateUrl: './user-form-dialog.component.html',
  styleUrl: './user-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormDialogComponent {
  form!: FormGroup;
  isEditMode = false;
  departamentos: { id: number; nombre: string }[] = [];
  cargos: { id: number; nombre: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserFormDialogComponent>,
    private userService: UserService,
    private catalogService: CatalogService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { isEdit: boolean; user?: any }
  ) { }

  ngOnInit(): void {
    this.isEditMode = this.data.isEdit;

    this.initForm();

    if (this.data) {
      this.form.patchValue(this.data);
    }

    this.catalogService.getDepartamentos().subscribe(data => this.departamentos = data);
    this.catalogService.getCargos().subscribe(data => this.cargos = data);
  }

  initForm(): void {
    this.form = this.fb.group({
      id: [null],
      usuario: ['', Validators.required],
      primerNombre: ['', Validators.required],
      segundoNombre: [''],
      primerApellido: ['', Validators.required],
      segundoApellido: [''],
      email: ['', [Validators.email]],
      idDepartamento: ['', Validators.required],
      idCargo: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const userData = this.form.value;

    const request$ = this.isEditMode
      ? this.userService.updateUser(userData.id, userData)
      : this.userService.createUser(userData);

      request$.subscribe({
        next: () => {
        const successMessage = this.isEditMode ? 'Usuario actualizado con éxito' : 'Usuario creado con éxito';

        this.dialogRef.close(true);

        this.snackBar.open(successMessage, 'Cerrar', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 3000
        });
      },
      error: (error) => {
        if (error.status === 422 && error.error?.message) {
          this.snackBar.open(error.error.message, 'Cerrar', {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            duration: 3000
          });
        } else {
          this.snackBar.open('Ocurrió un error.', 'Cerrar', {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            duration: 3000
          });
        }
      }
    });
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}
