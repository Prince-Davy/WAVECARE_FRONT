export interface Cta {
    label: string;
    url: string;
    target?: '_self' | '_blank';
    type?: 'link' | 'tab';
    tabTarget?: string;
}
