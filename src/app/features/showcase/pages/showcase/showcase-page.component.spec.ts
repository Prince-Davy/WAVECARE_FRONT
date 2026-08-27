import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { of } from 'rxjs';

import { AuthTokenService } from '@app/features/auth/services/auth-token.service';
import { NavigationService } from '@app/features/navigation/services/navigation.service';
import { Page } from '../../models/page.model';
import { Section } from '../../models/section.model';
import { PageService } from '../../services/page.service';
import { ShowcaseNavigationService } from '../../services/showcase-navigation.service';
import { ShowcasePageComponent } from './showcase-page.component';

describe('ShowcasePageComponent', () => {
    let component: ShowcasePageComponent;
    let fixture: ComponentFixture<ShowcasePageComponent>;
    let authToken: jasmine.SpyObj<AuthTokenService>;
    let navigationService: jasmine.SpyObj<NavigationService>;
    let pageService: jasmine.SpyObj<PageService>;
    let title: jasmine.SpyObj<Title>;
    let meta: jasmine.SpyObj<Meta>;

    const introductionSection: Section = {
        id: 1,
        title: 'Introduction',
        description: 'Présentation de WaveCare',
        sectionCards: [],
    };

    const supportSection: Section = {
        id: 2,
        title: 'Support',
        description: 'Aide aux utilisateurs',
        sectionCards: [],
    };

    const page: Page = {
        title: 'WaveCare',
        slug: '/',
        sections: [introductionSection, supportSection],
    };

    beforeEach(async () => {
        const authTokenSpy = jasmine.createSpyObj('AuthTokenService', ['isAuthenticated']);
        const navigationSpy = jasmine.createSpyObj('NavigationService', ['navigateToHome', 'navigateToLogin']);
        const pageServiceSpy = jasmine.createSpyObj('PageService', ['getBySlug']);
        const titleSpy = jasmine.createSpyObj('Title', ['setTitle']);
        const metaSpy = jasmine.createSpyObj('Meta', ['updateTag']);

        pageServiceSpy.getBySlug.and.returnValue(of(page));

        await TestBed.configureTestingModule({
            imports: [ShowcasePageComponent],
            providers: [
                provideTanStackQuery(new QueryClient({
                    defaultOptions: {
                        queries: {
                            retry: false,
                        },
                    },
                })),
                { provide: Title, useValue: titleSpy },
                { provide: Meta, useValue: metaSpy },
                { provide: AuthTokenService, useValue: authTokenSpy },
                { provide: NavigationService, useValue: navigationSpy },
                { provide: PageService, useValue: pageServiceSpy },
            ],
        })
            .overrideComponent(ShowcasePageComponent, {
                set: { template: '' },
            })
            .compileComponents();

        fixture = TestBed.createComponent(ShowcasePageComponent);
        component = fixture.componentInstance;
        authToken = TestBed.inject(AuthTokenService) as jasmine.SpyObj<AuthTokenService>;
        navigationService = TestBed.inject(NavigationService) as jasmine.SpyObj<NavigationService>;
        pageService = TestBed.inject(PageService) as jasmine.SpyObj<PageService>;
        title = TestBed.inject(Title) as jasmine.SpyObj<Title>;
        meta = TestBed.inject(Meta) as jasmine.SpyObj<Meta>;
    });

    function stabilizeFixture(): void {
        component.sections();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
    }

    it('devrait créer le composant', () => {
        expect(component).toBeTruthy();
    });

    it('devrait charger la page avec le slug courant', fakeAsync(() => {
        stabilizeFixture();

        expect(pageService.getBySlug).toHaveBeenCalledWith('/');
        expect(component.sections()).toEqual(page.sections);
    }));

    it('devrait sélectionner automatiquement la première section chargée', fakeAsync(() => {
        stabilizeFixture();

        expect(component.selectedSection()).toBe(introductionSection);
    }));

    it('devrait mettre à jour le titre et la description SEO avec le titre de la page', fakeAsync(() => {
        stabilizeFixture();

        expect(title.setTitle).toHaveBeenCalledWith('WaveCare');
        expect(meta.updateTag).toHaveBeenCalledWith({ name: 'description', content: 'WaveCare' });
    }));

    it('devrait sélectionner la section demandée par ShowcaseNavigationService', fakeAsync(() => {
        const showcaseNavigation = fixture.debugElement.injector.get(ShowcaseNavigationService);

        stabilizeFixture();
        showcaseNavigation.navigateToSection('Support');
        stabilizeFixture();

        expect(component.selectedSection()).toBe(supportSection);
        expect(showcaseNavigation.requestedSectionTitle()).toBeNull();
    }));

    it('devrait sélectionner explicitement une section', () => {
        component.selectSection(supportSection);

        expect(component.selectedSection()).toBe(supportSection);
    });

    it('devrait rediriger un utilisateur connecté vers son espace selon son rôle', () => {
        authToken.isAuthenticated.and.returnValue(true);

        component.goToMySpace();

        expect(navigationService.navigateToHome).toHaveBeenCalled();
        expect(navigationService.navigateToLogin).not.toHaveBeenCalled();
    });

    it('devrait rediriger un utilisateur non connecté vers la connexion', () => {
        authToken.isAuthenticated.and.returnValue(false);

        component.goToMySpace();

        expect(navigationService.navigateToLogin).toHaveBeenCalled();
        expect(navigationService.navigateToHome).not.toHaveBeenCalled();
    });
});