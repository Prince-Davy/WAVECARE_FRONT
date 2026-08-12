import { Component, computed, effect, inject, signal } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { PageService } from '../../services/page.service';
import { Section } from '../../models/section.model';
import { SectionComponent } from '../../components/section/section.component';

@Component({
    selector: 'app-showcase-page',
    standalone: true,
    imports: [SectionComponent],
    templateUrl: './showcase-page.component.html',
    styleUrls: ['./showcase-page.component.scss']
})
export class ShowcasePageComponent {
    private readonly pageService = inject(PageService);

    private readonly SLUG = '/';

    readonly pageQuery = injectQuery(() => ({
        queryKey: ['page', this.SLUG],
        queryFn: () => firstValueFrom(this.pageService.getBySlug(this.SLUG)),
    }));

    readonly sections = computed(() => this.pageQuery.data()?.sections ?? []);
    readonly selectedSection = signal<Section | null>(null);

    constructor() {
        // Sélectionne le premier onglet dès que les données arrivent
        effect(() => {
            const sections = this.sections();
            if (sections.length > 0 && !this.selectedSection()) {
                this.selectedSection.set(sections[0]);
            }
        });
    }

    selectSection(section: Section): void {
        this.selectedSection.set(section);
    }
}
