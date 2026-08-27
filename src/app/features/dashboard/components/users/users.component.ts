import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [RouterOutlet],
    template: '<router-outlet />'
})
export class UsersComponent { }
