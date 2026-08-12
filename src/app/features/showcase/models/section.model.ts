import { SectionCard } from './section-card.model';

export interface Section {
    title: string;
    description?: string;
    variant?: string;
    sectionCards: SectionCard[];
}
