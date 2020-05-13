import { LanguageService } from 'src/app/services/lang.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

let language = 'en';

export const langServiceMock: Partial<LanguageService> = {

  GetLang() {
    return new Observable(
      (val) => {
        val.next(new HttpResponse({status: 200, body: {lang: language}}));
        val.complete();
      }
    );
  },

  SetLang(newLang = 'en') {
    return new Observable(
      (val) => {
        language = newLang;
        val.next(new HttpResponse({status: 200}));
        val.complete();
      }
    );
  }
};
