export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

const getOAuthPortalBaseUrl = (oauthPortalUrl: string) => {
  const fallbackOrigin = window.location.origin;
  const rawBaseUrl = oauthPortalUrl.trim() || fallbackOrigin;

  try {
    return new URL(rawBaseUrl);
  } catch {
    return new URL(rawBaseUrl, fallbackOrigin);
  }
};

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL ?? "";
  const appId = import.meta.env.VITE_APP_ID ?? "";
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const portalBaseUrl = getOAuthPortalBaseUrl(oauthPortalUrl);
  const url = new URL("app-auth", `${portalBaseUrl.toString().replace(/\/?$/, "/")}`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
