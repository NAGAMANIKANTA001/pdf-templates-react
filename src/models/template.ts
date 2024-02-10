
export interface IVariable {
    name: string;
    value: string;
}

export interface Template {
    _id: string;
    name: string;
    templateString: string;
}

export interface TemplateUpdate {
    name?: string;
    templateString?: string;
}
export interface TemplatePost {
    name: string;
    templateString: string;
}