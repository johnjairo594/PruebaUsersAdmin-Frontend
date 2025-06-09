import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { UserTableComponent } from './features/user-table/user-table.component';


@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent, 
    UserTableComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'AdministracionUsuariosFront';
}
