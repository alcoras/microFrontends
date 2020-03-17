import { LanguageService } from 'src/app/services/lang.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

export let langServiceMock: Partial<LanguageService>;
let language = 'en';

langServiceMock = {
  getLang() {
    return new Observable(
      (val) => {
        val.next(new HttpResponse({status: 200, body: {lang: language}}));
        val.complete();
      }
    );
  },

  setLang(newLang = 'en') {
    return new Observable(
      (val) => {
        language = newLang;
        val.next(new HttpResponse({status: 200}));
        val.complete();
      }
    );
  }
};
