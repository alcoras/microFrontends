import { UrlScheme } from '@protocol-shared/events';

export class MenuUrlsStatus {
  public loaded = false;
  public elementToReplaceId: string;
  public elementToPlace: string;
  public urlShemes: UrlScheme[];
}
