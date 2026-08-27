import { Component, HostListener, computed, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Title, Meta } from '@angular/platform-browser';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { filter, firstValueFrom } from 'rxjs';
import { PageService } from '../../services/page.service';
import { ShowcaseNavigationService } from '../../services/showcase-navigation.service';
import { Section } from '../../models/section.model';
import { SectionComponent } from '../../components/section/section.component';
import { AuthTokenService } from '@app/features/auth/services/auth-token.service';
import { NavigationService } from '@app/features/navigation/services/navigation.service';

@Component({
    selector: 'app-showcase-page',
    standalone: true,
    imports: [SectionComponent],
    providers: [ShowcaseNavigationService],
    templateUrl: './showcase-page.component.html',
    styleUrls: ['./showcase-page.component.scss']
})
export class ShowcasePageComponent {
    private readonly pageService = inject(PageService);
    private readonly showcaseNav = inject(ShowcaseNavigationService);
    private readonly titleService = inject(Title);
    private readonly metaService = inject(Meta);
    private readonly navigationService = inject(NavigationService);
    readonly authToken = inject(AuthTokenService);

    // Injecté depuis route data via withComponentInputBinding
    readonly slug = input<string>('/');

    readonly pageQuery = injectQuery(() => ({
        queryKey: ['page', this.slug()],
        queryFn: () => firstValueFrom(this.pageService.getBySlug(this.slug())),
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

        // Met à jour les balises SEO dès que la page est chargée
        effect(() => {
            const page = this.pageQuery.data();
            if (page) {
                this.titleService.setTitle(page.title);
                this.metaService.updateTag({ name: 'description', content: page.title });
            }
        });

        // toObservable évite les writes dans un effect
        toObservable(this.showcaseNav.requestedSectionTitle)
            .pipe(filter(Boolean), takeUntilDestroyed())
            .subscribe(title => {
                const target = this.sections().find(s => s.title === title);
                if (target) {
                    this.selectedSection.set(target);
                } else {
                    console.warn(`[ShowcasePage] tabTarget introuvable : "${title}"`);
                }
                this.showcaseNav.clearRequest();
            });
    }

    selectSection(section: Section): void {
        this.selectedSection.set(section);

        document.getElementById(this.getSectionElementId(section))?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }

    @HostListener('window:scroll')
    syncSelectedSection(): void {
        const marker = window.scrollY + window.innerHeight * 0.35;
        const visibleSection = this.sections()
            .map(section => ({
                section,
                element: document.getElementById(this.getSectionElementId(section)),
            }))
            .filter(item => item.element && item.element.offsetTop <= marker)
            .at(-1)?.section;

        if (visibleSection && visibleSection !== this.selectedSection()) {
            this.selectedSection.set(visibleSection);
        }
    }

    private getSectionElementId(section: Section): string {
        return `showcase-section-${section.id}`;
    }

    goToMySpace(): void {
        if (this.authToken.isAuthenticated()) {
            this.navigationService.navigateToHome();
        } else {
            this.navigationService.navigateToLogin();
        }
    }
}
