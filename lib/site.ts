export const WA_NUMBER = "6281270389862";
export const WA_DISPLAY = "0812-7038-9862";
export const IG_URL = "https://www.instagram.com/apptivity.id";
export const SITE_URL = "https://apptivity.id";
export const SITE_NAME = "Apptivity";
export const SITE_DOMAIN = "apptivity.id";
export const TAGLINE = "Apps for every activity";
export const COMPANY = "PT Lawson Semesta Indonesia";

export function waLink(text: string): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}
