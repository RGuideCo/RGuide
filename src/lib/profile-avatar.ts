export const DEFAULT_PROFILE_AVATAR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
      <rect width="160" height="160" rx="80" fill="#e2e8f0" />
      <circle cx="80" cy="62" r="28" fill="#64748b" />
      <path d="M36 136c8-28 24-42 44-42s36 14 44 42" fill="#64748b" />
    </svg>
  `);

export function isGeneratedProfileAvatar(avatarUrl: string | null | undefined) {
  const trimmedAvatarUrl = avatarUrl?.trim();

  if (!trimmedAvatarUrl) {
    return true;
  }

  return (
    trimmedAvatarUrl === DEFAULT_PROFILE_AVATAR ||
    /^https?:\/\/i\.pravatar\.cc\//i.test(trimmedAvatarUrl)
  );
}

export function getProfileAvatarUrl(avatarUrl: string | null | undefined) {
  const trimmedAvatarUrl = avatarUrl?.trim();

  return trimmedAvatarUrl && !isGeneratedProfileAvatar(trimmedAvatarUrl)
    ? trimmedAvatarUrl
    : DEFAULT_PROFILE_AVATAR;
}
