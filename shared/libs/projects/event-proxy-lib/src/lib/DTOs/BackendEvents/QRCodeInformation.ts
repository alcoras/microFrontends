import { CoreEvent } from "../CoreEvent";

export class QRCodeInformation extends CoreEvent {
	/**
   * Message encoded in QR code image
   */
  public QRCodeMessage: string;
  /**
   * QR code image in Base64String format
   */
  public QRCodeImage: string;
}
