import { ChangeDetectionStrategy, Component, AfterViewInit, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserService, User, RawUser } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteConfirmationDialogComponent } from '@app/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { UserFilterComponent } from '../user-filter/user-filter.component';
import { UserFormDialogComponent } from '@app/user-form-dialog/user-form-dialog.component';

@Component({
  selector: 'app-user-table',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    UserFilterComponent
  ],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  selectedDepartamentoId?: number;
  selectedCargoId?: number;

  displayedColumns: string[] = ['usuario', 'nombres', 'apellidos', 'departamento', 'cargo', 'email', 'acciones'];
  pageIndex = 0;
  pageSize = 10;
  totalItems = 0;
  rawUsers: RawUser[] = [];
  dataSource: User[] = [];

  constructor(private userService: UserService, private dialog: MatDialog, private snackBar: MatSnackBar, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadUsers(this.pageIndex, this.pageSize);
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      this.loadUsers(this.paginator.pageIndex, this.paginator.pageSize);
    });
  }

  loadUsers(pageIndex: number, pageSize: number) {
    const page = pageIndex + 1;

    const filters: any = {};
    if (this.selectedDepartamentoId && this.selectedDepartamentoId !== 0) {
      filters.idDepartamento = this.selectedDepartamentoId;
    }
    if (this.selectedCargoId && this.selectedCargoId !== 0) {
      filters.idCargo = this.selectedCargoId;
    }

    this.userService.getUsers(page, pageSize, filters).subscribe(response => {
      this.rawUsers = response.data;
      this.dataSource = this.rawUsers.map(user => this.transformUser(user));
      this.totalItems = response.total;
      this.cdr.detectChanges();
    });
  }

  transformUser(rawUser: RawUser): User {
    return {
      id: rawUser.id,
      usuario: rawUser.usuario,
      nombres: `${rawUser.primerNombre} ${rawUser.segundoNombre ?? ''}`.trim(),
      apellidos: `${rawUser.primerApellido} ${rawUser.segundoApellido ?? ''}`.trim(),
      primerNombre: rawUser.primerNombre,
      segundoNombre: rawUser.segundoNombre || '',
      primerApellido: rawUser.primerApellido,
      segundoApellido: rawUser.segundoApellido || '',
      departamento: rawUser.departamento?.nombre || '',
      cargo: rawUser.cargo?.nombre || '',
      email: rawUser.email ?? '',
      idDepartamento: rawUser.idDepartamento || null,
      idCargo: rawUser.idCargo || null
    };
  }

  onUserCreated() {
    this.pageIndex = 0;
    this.loadUsers(this.pageIndex, this.pageSize);
  }

  editarUsuario(user: User): void {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '500px',
      data: { isEdit: true, ...user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers(this.paginator.pageIndex, this.paginator.pageSize);
      }
    });
  }

  eliminarUsuario(user: User) {
    this.confirmDelete(user);
  }

  confirmDelete(user: any): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '400px',
      data: { usuario: user.usuario }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.snackBar.open('Usuario eliminado correctamente.', 'Cerrar', {
              horizontalPosition: 'end',
              verticalPosition: 'top',
              duration: 3000,
            });
            this.loadUsers(this.paginator.pageIndex, this.paginator.pageSize);
          },
          error: () => {
            this.snackBar.open('Error al eliminar el usuario.', 'Cerrar', {
              horizontalPosition: 'end',
              verticalPosition: 'top',
              duration: 3000,
            });
          }
        });
      }
    });
  }

  onFilterChanged(filters: { idDepartamento?: number; idCargo?: number }) {
    this.selectedDepartamentoId = filters.idDepartamento;
    this.selectedCargoId = filters.idCargo;
    this.loadUsers(this.paginator.pageIndex, this.paginator.pageSize);
  }
}