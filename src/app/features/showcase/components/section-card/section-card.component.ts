import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { SectionCard } from '../../models/section-card.model';

@Component({
    selector: 'app-section-card',
    standalone: true,
    imports: [MatCardModule, MatButtonModule],
    templateUrl: './section-card.component.html',
    styleUrls: ['./section-card.component.scss']
})
export class SectionCardComponent {
    readonly sectionCard = input.required<SectionCard>();
}
