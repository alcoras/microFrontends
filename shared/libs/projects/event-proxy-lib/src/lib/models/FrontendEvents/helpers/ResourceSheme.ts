/**
 * Resource sheme for loading HTML element (script or link) into DOM
 */
export class ResourceSheme {
    /**
     * Element used to indicate what type of element this resource is (string, link..)
     */
    public Element: string;

    /**
     * Attributes dictionary for every other attribute this element should contain
     */
    public Attributes: { [attrName: string]: string } = {};

    /**
     * Sets (or adds) attribute to the attributes dictionary
     * @param attr attribute's name
     * @param value attribute's value
     */
    public setAttribute(attr: string, value: string): void {
        this.Attributes[attr] = value;
    }
}
