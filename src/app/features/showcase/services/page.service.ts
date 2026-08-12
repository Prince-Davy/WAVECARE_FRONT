import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ConfigService } from '@app/config.service';
import { Page } from '../models/page.model';

interface StrapiListResponse<T> {
    data: T[];
}

@Injectable({ providedIn: 'root' })
export class PageService {
    private readonly http = inject(HttpClient);
    private readonly config = inject(ConfigService);

    getBySlug(slug: string): Observable<Page> {
        // Dot-notation populate : compatible Strapi v4 et v5
        const params = new HttpParams()
            .set('filters[slug][$eq]', slug)
            .set('populate[0]', 'sections')
            .set('populate[1]', 'sections.sectionCards')
            .set('populate[2]', 'sections.sectionCards.cards')
            .set('populate[3]', 'sections.sectionCards.ctas');

        const token = this.config.strapiApiToken;
        const headers = token
            ? new HttpHeaders({ Authorization: `Bearer ${token}` })
            : new HttpHeaders();

        // URL absolue : l'intercepteur apiBaseUrl est ainsi contourné
        return this.http
            .get<StrapiListResponse<Page>>(`${this.config.strapiBaseUrl}/api/pages`, { params, headers })
            .pipe(map(res => res.data[0]));
    }
}
