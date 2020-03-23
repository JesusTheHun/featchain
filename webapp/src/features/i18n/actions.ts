import { createAction } from 'typesafe-actions';

export const setLanguage = createAction('I18N_SET_LANGUAGE')<string>();

export default {
    setLanguage,
}
