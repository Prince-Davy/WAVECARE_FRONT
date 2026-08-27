import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { SectionCard } from '../../models/section-card.model';
import { ShowcaseNavigationService } from '../../services/showcase-navigation.service';

@Component({
    selector: 'app-section-card',
    standalone: true,
    imports: [MatCardModule, MatButtonModule],
    templateUrl: './section-card.component.html',
    styleUrls: ['./section-card.component.scss']
})
export class SectionCardComponent {
    readonly sectionCard = input.required<SectionCard>();

    private readonly showcaseNav = inject(ShowcaseNavigationService);

    navigateToTab(sectionTitle: string): void {
        this.showcaseNav.navigateToSection(sectionTitle);
    }
}
