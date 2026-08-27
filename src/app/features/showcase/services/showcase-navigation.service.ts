import { Injectable, signal } from '@angular/core';

// Pas de providedIn : scopé au ShowcasePageComponent via providers[]
@Injectable()
export class ShowcaseNavigationService {
    private readonly _requestedSectionTitle = signal<string | null>(null);
    readonly requestedSectionTitle = this._requestedSectionTitle.asReadonly();

    navigateToSection(title: string): void {
        this._requestedSectionTitle.set(title);
    }

    clearRequest(): void {
        this._requestedSectionTitle.set(null);
    }
}
