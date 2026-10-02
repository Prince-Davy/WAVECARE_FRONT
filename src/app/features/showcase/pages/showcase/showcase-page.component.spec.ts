import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import {
    provideTanStackQuery,
    QueryClient,
} from '@tanstack/angular-query-experimental';
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

    let authToken: AuthTokenService;
    let navigationService: NavigationService;
    let pageService: PageService;
    let title: Title;
    let meta: Meta;

    let authenticated: boolean;

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
        authenticated = false;

        const authTokenStub = {
            isAuthenticated: () => authenticated,
        };

        const navigationSpy = {
            navigateToHome: () => undefined,
            navigateToLogin: () => undefined,
        };

        const pageServiceSpy = {
            getBySlug: (_slug: string) => of(page),
        };

        const titleSpy = {
            setTitle: (_title: string) => undefined,
        };

        const metaSpy = {
            updateTag: (_tag: object) => null,
        };

        spyOn(navigationSpy, 'navigateToHome');
        spyOn(navigationSpy, 'navigateToLogin');

        spyOn(pageServiceSpy, 'getBySlug')
            .and.returnValue(of(page));

        spyOn(titleSpy, 'setTitle');
        spyOn(metaSpy, 'updateTag');

        await TestBed.configureTestingModule({
            imports: [ShowcasePageComponent],
            providers: [
                provideTanStackQuery(
                    new QueryClient({
                        defaultOptions: {
                            queries: {
                                retry: false,
                            },
                        },
                    }),
                ),
                {
                    provide: Title,
                    useValue: titleSpy,
                },
                {
                    provide: Meta,
                    useValue: metaSpy,
                },
                {
                    provide: AuthTokenService,
                    useValue: authTokenStub,
                },
                {
                    provide: NavigationService,
                    useValue: navigationSpy,
                },
                {
                    provide: PageService,
                    useValue: pageServiceSpy,
                },
            ],
        })
            .overrideComponent(ShowcasePageComponent, {
                set: {
                    template: '',
                },
            })
            .compileComponents();

        fixture = TestBed.createComponent(ShowcasePageComponent);
        component = fixture.componentInstance;

        authToken = TestBed.inject(AuthTokenService);
        navigationService = TestBed.inject(NavigationService);
        pageService = TestBed.inject(PageService);
        title = TestBed.inject(Title);
        meta = TestBed.inject(Meta);
    });

    afterEach(() => {
        globalThis.history.replaceState(
            null,
            '',
            globalThis.location.pathname + globalThis.location.search,
        );
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

    it(
        'devrait sélectionner automatiquement la première section chargée',
        fakeAsync(() => {
            stabilizeFixture();

            expect(component.selectedSection()).toBe(
                introductionSection,
            );
        }),
    );

    it(
        'devrait mettre à jour le titre et la description SEO avec le titre de la page',
        fakeAsync(() => {
            stabilizeFixture();

            expect(title.setTitle).toHaveBeenCalledWith('WaveCare');

            expect(meta.updateTag).toHaveBeenCalledWith({
                name: 'description',
                content: 'WaveCare',
            });
        }),
    );

    it(
        'devrait sélectionner la section demandée par ShowcaseNavigationService',
        fakeAsync(() => {
            const showcaseNavigation =
                fixture.debugElement.injector.get(
                    ShowcaseNavigationService,
                );

            stabilizeFixture();

            showcaseNavigation.navigateToSection('Support');

            stabilizeFixture();

            expect(component.selectedSection()).toBe(
                supportSection,
            );

            expect(
                showcaseNavigation.requestedSectionTitle(),
            ).toBeNull();
        }),
    );

    it(
        'devrait sélectionner explicitement une section et défiler en douceur',
        () => {
            const scrollTarget = {
                scrollIntoView: (
                    _options?: ScrollIntoViewOptions,
                ) => undefined,
            } as unknown as HTMLElement;

            const scrollIntoViewSpy = spyOn(
                scrollTarget,
                'scrollIntoView',
            );

            spyOn(
                document,
                'getElementById',
            ).and.returnValue(scrollTarget);

            component.selectSection(supportSection);

            expect(component.selectedSection()).toBe(
                supportSection,
            );

            expect(globalThis.location.hash).toBe(
                '#showcase-section-2',
            );

            expect(
                scrollIntoViewSpy,
            ).toHaveBeenCalled();
        },
    );

    it(
    'devrait sélectionner au chargement la section indiquée dans le hash',
    fakeAsync(() => {
        globalThis.history.replaceState(
            null,
            '',
            `${globalThis.location.pathname}${globalThis.location.search}#showcase-section-2`,
        );

        const scrollTarget = {
            scrollIntoView: (
                _options?: ScrollIntoViewOptions,
            ) => undefined,
        } as unknown as HTMLElement;

        const scrollIntoViewSpy = spyOn(
            scrollTarget,
            'scrollIntoView',
        );

        spyOn(
            document,
            'getElementById',
        ).and.returnValue(scrollTarget);

        let animationFrameCallback:
            | FrameRequestCallback
            | undefined;

        const animationFrameSpy = spyOn(
            globalThis,
            'requestAnimationFrame',
        ).and.callFake(
            (callback: FrameRequestCallback): number => {
                animationFrameCallback = callback;
                return 1;
            },
        );

        stabilizeFixture();

        expect(component.selectedSection()).toBe(
            supportSection,
        );

        expect(
            animationFrameSpy,
        ).toHaveBeenCalled();

        expect(
            animationFrameCallback,
        ).toBeDefined();

        animationFrameCallback?.(0);

        expect(
            scrollIntoViewSpy,
        ).toHaveBeenCalled();
    }),
);

    it(
        'devrait avertir lorsqu’une section demandée est introuvable',
        fakeAsync(() => {
            const showcaseNavigation =
                fixture.debugElement.injector.get(
                    ShowcaseNavigationService,
                );

            const warnSpy = spyOn(console, 'warn');

            stabilizeFixture();

            showcaseNavigation.navigateToSection(
                'Section inconnue',
            );

            stabilizeFixture();

            expect(warnSpy).toHaveBeenCalledWith(
                '[ShowcasePage] tabTarget introuvable : "Section inconnue"',
            );

            expect(
                showcaseNavigation.requestedSectionTitle(),
            ).toBeNull();
        }),
    );

    it(
        'devrait synchroniser la section visible et la progression du scroll',
        fakeAsync(() => {
            stabilizeFixture();

            const introductionElement = {
                offsetTop: 100,
            } as HTMLElement;

            const supportElement = {
                offsetTop: 700,
            } as HTMLElement;

            spyOn(
                document,
                'getElementById',
            ).and.callFake((id: string) => {
                if (id === 'showcase-section-1') {
                    return introductionElement;
                }

                if (id === 'showcase-section-2') {
                    return supportElement;
                }

                return null;
            });

            spyOnProperty(
                globalThis,
                'scrollY',
                'get',
            ).and.returnValue(500);

            spyOnProperty(
                globalThis,
                'innerHeight',
                'get',
            ).and.returnValue(1000);

            spyOnProperty(
                document.documentElement,
                'scrollHeight',
                'get',
            ).and.returnValue(2000);

            component.syncSelectedSection();

            expect(component.scrollProgress()).toBe(50);

            expect(component.selectedSection()).toBe(
                supportSection,
            );

            expect(globalThis.location.hash).toBe(
                '#showcase-section-2',
            );
        }),
    );

    it(
        'devrait garder une progression nulle si la page n’est pas scrollable',
        fakeAsync(() => {
            stabilizeFixture();

            const initiallySelected =
                component.selectedSection();

            spyOn(
                document,
                'getElementById',
            ).and.returnValue(null);

            spyOnProperty(
                globalThis,
                'scrollY',
                'get',
            ).and.returnValue(0);

            spyOnProperty(
                globalThis,
                'innerHeight',
                'get',
            ).and.returnValue(1000);

            spyOnProperty(
                document.documentElement,
                'scrollHeight',
                'get',
            ).and.returnValue(1000);

            component.syncSelectedSection();

            expect(component.scrollProgress()).toBe(0);

            expect(component.selectedSection()).toBe(
                initiallySelected,
            );
        }),
    );

    it(
        'devrait synchroniser la section depuis le hash sans scroll fluide',
        fakeAsync(() => {
            stabilizeFixture();

            globalThis.history.replaceState(
                null,
                '',
                `${globalThis.location.pathname}${globalThis.location.search}#showcase-section-2`,
            );

            const scrollTarget = {
                scrollIntoView: (
                    _options?: ScrollIntoViewOptions,
                ) => undefined,
            } as unknown as HTMLElement;

            const scrollIntoViewSpy = spyOn(
                scrollTarget,
                'scrollIntoView',
            );

            spyOn(
                document,
                'getElementById',
            ).and.returnValue(scrollTarget);

            component.syncSectionFromUrl();

            expect(component.selectedSection()).toBe(
                supportSection,
            );

            expect(
                scrollIntoViewSpy,
            ).toHaveBeenCalled();

            component.syncSectionFromUrl();

            expect(
                scrollIntoViewSpy,
            ).toHaveBeenCalledTimes(1);
        }),
    );

    it('devrait remonter en haut de la page', () => {
        const scrollToSpy = spyOn(
            globalThis,
            'scrollTo',
        );

        component.scrollToTop();

        expect(scrollToSpy).toHaveBeenCalled();
    });

    it(
        'devrait rediriger un utilisateur connecté vers son espace selon son rôle',
        () => {
            authenticated = true;

            component.goToMySpace();

            expect(
                navigationService.navigateToHome,
            ).toHaveBeenCalled();

            expect(
                navigationService.navigateToLogin,
            ).not.toHaveBeenCalled();
        },
    );

    it(
        'devrait rediriger un utilisateur non connecté vers la connexion',
        () => {
            authenticated = false;

            component.goToMySpace();

            expect(
                navigationService.navigateToLogin,
            ).toHaveBeenCalled();

            expect(
                navigationService.navigateToHome,
            ).not.toHaveBeenCalled();
        },
    );
});