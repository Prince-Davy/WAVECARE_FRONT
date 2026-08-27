import { SectionCard } from './section-card.model';

export interface Section {
    id: number;
    title: string;
    description?: string;
    variant?: string;
    sectionCards: SectionCard[];
}
