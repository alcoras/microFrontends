export class ResourceSheme {
    public Element: string;
    public Attributes: {
        [attrName: string]: string;
    } = {};
    public setAttribute(attr: string, value: string) {
        this.Attributes[attr] = value;
    }
}
