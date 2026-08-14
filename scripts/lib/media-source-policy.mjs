const SCREENSHOT_SERVICE_HOSTS = new Set([
  "api.screenshotlayer.com",
  "api.screenshotmachine.com",
  "api.screenshotone.com",
  "api.urlbox.io",
  "image.thum.io",
  "screenshotapi.net",
  "screenshotlayer.com",
  "screenshotmachine.com",
  "screenshotone.com",
  "shot.screenshotapi.net",
  "thum.io",
  "urlbox.io",
]);

export function isScreenshotServiceUrl(value) {
  if (!value) return false;
  try {
    const hostname = new URL(String(value)).hostname.toLowerCase().replace(/^www\./, "");
    return SCREENSHOT_SERVICE_HOSTS.has(hostname);
  } catch {
    return false;
  }
}

export function assertAllowedMediaSourceUrl(value, context = "media source") {
  if (isScreenshotServiceUrl(value)) {
    throw new Error(`${context} uses a forbidden webpage screenshot service: ${value}`);
  }
}
