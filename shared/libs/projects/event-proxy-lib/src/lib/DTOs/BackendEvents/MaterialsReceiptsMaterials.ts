import { CoreEvent } from "../CoreEvent";
import { EventIds } from "../EventIds";
import { MicroFrontendInfo } from "../MicroFrontendInfo";
import { MaterialsData } from "./Adds/MaterialsData";

export enum MaterialsReceiptsMaterialsAddRemoveFlag {
    Create = EventIds.MaterialsReceiptsMaterialsAdd,
    Delete = EventIds.MaterialsReceiptsMaterialsRemove
}

export class MaterialsReceiptsMaterials extends CoreEvent {

  /**
   * Reference to Materials by Id
   */
  public MaterialsId?: number;

  /**
   * Name of material
   */
  public Name: string;

  /**
   * Comment about material
   */
  public CommentMaterials: string;

  /**
   * Material"s BarCode
   */
  public BarCode: string;

  public constructor(sourceInfo: MicroFrontendInfo, materialData: MaterialsData, addRemoveFlag: MaterialsReceiptsMaterialsAddRemoveFlag) {
    super();

    this.MaterialsId = materialData.Id;
    this.Name = materialData.Name;
    this.CommentMaterials = materialData.Comment;
    this.BarCode = materialData.BarCode;

    this.SourceId = sourceInfo.SourceId;
    this.SourceName = sourceInfo.SourceName;
    this.EventId = addRemoveFlag;
  }
}
