/**
 * The JaxFast app, promoted on every page. Everything said about it here
 * comes from its Google Play listing; don't add features that aren't there.
 */

/** JaxFast on Google Play. The package name keeps the app's original "jaxfit" id. */
export const JAXFAST_PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.jaxenlabs.jaxfit";

export const jaxfast = {
  name: "JaxFast",
  title: "JaxFast: Fasting & Weight Loss",
  /** The Play Store link, with this site and the button's `placement` as the install source. */
  play: (placement: string) => `${JAXFAST_PLAY_STORE_URL}&referrer=utm_source%3Dweb_jaxfast_hub%26utm_content%3D${placement}`,
  headline: "Offline Intermittent Fasting & Meal Planner, Healthy Recipes & Habit Garden",
  pillars: [
    {
      icon: "lock",
      title: "100% Offline & Private",
      text: "No account and no ads. An encrypted database, optional Google Drive backup and App Lock with fingerprint, face or PIN.",
    },
    {
      icon: "clock",
      title: "Fasting Plans & Live Dial",
      text: "Plans from 12:12 to 24h, custom fasts and 5:2 or 4:3 weekly plans, with a live dial through six body stages.",
    },
    {
      icon: "bowl",
      title: "Recipes & Meal Plans",
      text: "Dishes from North America, Latin America, Europe, the Middle East, South Asia, East Asia, Southeast Asia, Africa and Oceania, filtered for your food allergies.",
    },
    {
      icon: "drop",
      title: "Water, Weight & BMI Tracker",
      text: "Log your water through the day and follow your weight and BMI over time.",
    },
    {
      icon: "sprout",
      title: "The Habit Garden",
      text: "Healthy habits grow your garden, and it never punishes you for a rest day.",
    },
    {
      icon: "shield",
      title: "Safety Health Check",
      text: "A safety health check helps keep your fasting plan right for you. JaxFast Pro is optional.",
    },
  ],
} as const;
