/**
 * Resource sheme
 * @field Element used to indicate what type of element this resource is (string, link..)
 * @field Attributes dictionary for every other attribute this element should contain
 */
export class ResourceSheme {
    /**
     * Element name (script, link)
     */
    public Element: string;

    /**
     * Attributes of resource sheme contained in Dictionary
     */
    public Attributes: { [attrName: string]: string; } = {};

    /**
     * Sets attribute by adding them to attributes array
     * @param attr attribute's name
     * @param value attribute's value
     */
    public setAttribute(attr: string, value: string) {
        this.Attributes[attr] = value;
    }
}
