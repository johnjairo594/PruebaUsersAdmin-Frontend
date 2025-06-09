import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Output, EventEmitter } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { UserFormDialogComponent } from '@app/user-form-dialog/user-form-dialog.component';
import { UserService } from '@app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CatalogService } from '@app/services/catalog.service';

@Component({
  selector: 'app-user-filter',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './user-filter.component.html',
  styleUrl: './user-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFilterComponent {
  @Output() userCreated = new EventEmitter<void>();
  @Output() filterChanged = new EventEmitter<{ idDepartamento?: number; idCargo?: number }>();

  departamentos: { id: number; nombre: string }[] = [];
  cargos: { id: number; nombre: string }[] = [];
  selectedDepartamento: number | null = null;
  selectedCargo: number | null = null;

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private catalogService: CatalogService
  ) { }

  ngOnInit(): void {
    this.catalogService.getDepartamentos().subscribe(data => this.departamentos = data);
    this.catalogService.getCargos().subscribe(data => this.cargos = data);
  }

  openCreateUserDialog() {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '500px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userCreated.emit();
      }
    });
  }

  onFilterChange() {
    this.filterChanged.emit({
      idDepartamento: this.selectedDepartamento || undefined,
      idCargo: this.selectedCargo || undefined
    });
  }
}
