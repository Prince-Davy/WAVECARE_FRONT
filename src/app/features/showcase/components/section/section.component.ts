import { Component, input } from '@angular/core';
import { Section } from '../../models/section.model';
import { SectionCardComponent } from '../section-card/section-card.component';

@Component({
    selector: 'app-section',
    standalone: true,
    imports: [SectionCardComponent],
    templateUrl: './section.component.html',
    styleUrls: ['./section.component.scss']
})
export class SectionComponent {
    readonly section = input.required<Section>();
}
