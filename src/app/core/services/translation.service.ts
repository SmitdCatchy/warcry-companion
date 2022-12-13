import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageKey } from '../enums/local-keys.enum';
import { CoreService } from './core.service';
import { Language } from '../enums/language.enum';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  currentLanguage: BehaviorSubject<Language>;

  constructor(private translate: TranslateService) {
    this.translate.addLangs(Object.values(Language));
    this.currentLanguage = new BehaviorSubject(CoreService.getLocalStorage(LocalStorageKey.Language, Language.English) as Language);
    this.currentLanguage.subscribe((lang: string) => {
      this.translate.use(lang);
      this.translate.currentLang = lang;
      CoreService.setLocalStorage(LocalStorageKey.Language, lang)
      this.translate.setTranslation(lang, `assets/i18n/${lang}.json`, true);
    });
  }

  get language(): Language {
    return this.currentLanguage.value;
  }

  set language(lang: Language) {
    if (lang !== this.language) {
      this.currentLanguage.next(lang);
    }
  }

  setLanguage(lang: Language) {
    if (lang !== this.language) {
      this.currentLanguage.next(lang);
    }
  }
}
