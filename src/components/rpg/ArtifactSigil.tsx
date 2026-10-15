import type { CSSProperties } from 'react';
import { RpgIcon, type RpgIconName } from './RpgIcon';

/** Engraved vector emblem shared by the gallery and the collectible viewer. */
export function ArtifactSigil({ icon, color = '43 92% 64%', className = '' }: { icon: RpgIconName; color?: string; className?: string }) {
  return <div className={`artifact-sigil ${className}`} style={{ '--relic-color': color } as CSSProperties} aria-hidden="true">
    <svg className="sigil-orbit" viewBox="0 0 160 160" fill="none">
      <circle cx="80" cy="80" r="68" stroke="currentColor" strokeOpacity=".35" />
      <circle cx="80" cy="80" r="59" stroke="currentColor" strokeOpacity=".2" strokeDasharray="2 8" />
      <path d="m80 5 4 7-4 7-4-7zM155 80l-7 4-7-4 7-4zM80 155l-4-7 4-7 4 7zM5 80l7-4 7 4-7 4z" fill="currentColor" fillOpacity=".8" />
      <path d="M26 26l108 108M134 26 26 134" stroke="currentColor" strokeOpacity=".1" />
    </svg>
    <span className="sigil-core"><RpgIcon name={icon} size={60} strokeWidth={1.15} /></span>
    <i className="sigil-star sigil-star-one" /><i className="sigil-star sigil-star-two" />
  </div>;
}
