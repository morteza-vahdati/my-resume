/**
 * API messages carry both languages and the client picks one, so a response
 * cached or logged upstream is never locked to the wrong locale.
 */
export interface LocalizedMessage {
  en: string
  fa: string
}

export function msg(en: string, fa: string): LocalizedMessage {
  return { en, fa }
}
