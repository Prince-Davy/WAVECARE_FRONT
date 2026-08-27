import { Card } from './card.model';
import { Cta } from './cta.model';

export interface SectionCard {
    id: number;
    title: string;
    description?: string;
    cards: Card[];
    ctas?: Cta[];
}
