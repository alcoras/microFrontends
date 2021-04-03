import { Pipe, PipeTransform } from "@angular/core";
import { environment } from "src/environments/environment";
import { Translations } from "../../translations/Translations";

@Pipe({
  name: "translate",
  pure: false
})
export class TranslatePipe implements PipeTransform {

  public transform(value: string): string {
    return Translations[value][environment.currentLanguage];
  }

}
