/**
 * Shows user's uploaded photo or a default avatar.
 * If user.avatarUrl is set, use that; otherwise use the default avatar image.
 */
const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239acfaa'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

export function UserAvatar({ user, size = 36, className = '', ...rest }) {
  const src = user?.avatarUrl || DEFAULT_AVATAR;
  const s = typeof size === 'number' ? `${size}px` : size;
  return (
    <img
      src={src}
      alt=""
      className={className}
      style={{
        width: s,
        height: s,
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid var(--border)',
        background: 'var(--bg-card)',
        ...rest.style,
      }}
      {...rest}
    />
  );
}
