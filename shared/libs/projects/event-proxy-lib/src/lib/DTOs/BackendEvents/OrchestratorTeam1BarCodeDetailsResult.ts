import { CoreEvent } from "../CoreEvent";
import { BarCodeCast } from "./Adds/BarCodeCast";

export class OrchestratorTeam1BarCodeDetailsResult extends CoreEvent {

    /**
     * BarCode relation with list
     */
    public BarCodeDetails: BarCodeCast[];
}
