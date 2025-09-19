import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardComponent } from '../../abstract/dashboard-component.abstract';

@Component({
  selector: 'app-user-table',
  imports: [TranslateModule],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss'
})
export class UserTableComponent extends DashboardComponent {

}
