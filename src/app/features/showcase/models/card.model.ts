import { Cta } from './cta.model';

export interface ListTextItem {
    id: number;
    text: string;
}

export interface Card {
    title: string;
    description?: string;
    listText?: ListTextItem[];
    ctas?: Cta[];
}
