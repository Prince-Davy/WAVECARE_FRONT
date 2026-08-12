import { Card } from './card.model';
import { Cta } from './cta.model';

export interface SectionCard {
    title: string;
    description?: string;
    cards: Card[];
    ctas?: Cta[];
}
