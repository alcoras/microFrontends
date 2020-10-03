/**
 * Material List data
 */
 export class MaterialsList {

    public Id: number;

    /**
     * Receipt number
     */
    public Number: number;

    /**
     * Receipt registration date and time (ISO formatted)
     */
    public RegisterDateTime: string;

    /**
     * Sign mark (true if signed)
     */
    public SignMark?: boolean;

    /**
     * Signee
     */
    public SignPerson: string;
}
