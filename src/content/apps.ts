/**
 * The JaxFit app, promoted on every page.
 *
 * JAXFIT LAUNCH: paste JaxFit's Google Play address into
 * JAXFIT_PLAY_STORE_URL below. Every "Coming Soon" badge on every page then
 * becomes a live "Get it on Google Play" button. Nothing else needs to change.
 */
export const JAXFIT_PLAY_STORE_URL = null as string | null;

export const jaxfit = {
  name: "JaxFit",
  title: "JaxFit: Fasting & Weight Loss",
  /** The Play Store link with this site as the install source, once JaxFit is live. */
  play: (placement: string) =>
    JAXFIT_PLAY_STORE_URL ? `${JAXFIT_PLAY_STORE_URL}${JAXFIT_PLAY_STORE_URL.includes("?") ? "&" : "?"}referrer=utm_source%3Dweb_jaxfit_hub%26utm_content%3D${placement}` : null,
  headline: "Take Your Fasting Schedule, Meal Plans & Habit Garden Offline",
  pillars: [
    {
      icon: "lock",
      title: "100% Offline & Encrypted",
      text: "Zero accounts, zero cloud servers, passphrase-encrypted .jaxfit backups and a biometric or PIN lock.",
    },
    {
      icon: "bowl",
      title: "Global Halal Meal Plans & Recipes",
      text: "Curated Window Openers, Window Closers and Healthy Snacks from South Asian, Middle Eastern, North American, East Asian, Latin American, Southeast Asian and West African kitchens, with full macros and “I made this” Kitchen Garden rewards.",
    },
    {
      icon: "sprout",
      title: "The Habit Garden",
      text: "Progress without punishment: plants never die, and rest days keep your progress safe.",
    },
    {
      icon: "bolt",
      title: "Live Cellular Renewal & Hydration Tracker",
      text: "Real-time glycogen, ketosis and autophagy insights, plus timer notifications while you fast.",
    },
  ],
} as const;
