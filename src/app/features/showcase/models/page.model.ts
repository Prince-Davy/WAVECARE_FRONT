import { Section } from './section.model';

export interface Page {
    title: string;
    slug: string;
    sections: Section[];
}
