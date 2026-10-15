import { ReactNode } from 'react';

export type RpgIconName =
  | 'castle' | 'sword' | 'tome' | 'shield' | 'helm' | 'gem' | 'orb' | 'lock' | 'scroll'
  | 'satchel' | 'trophy' | 'medal' | 'map' | 'flame' | 'star' | 'quill' | 'crown'
  | 'chest' | 'eye' | 'compass' | 'moon' | 'spark' | 'tree' | 'hourglass' | 'mirror' | 'wings';

// Hand-drawn 24x24 line icons with a faint fill for depth. Colour comes from `currentColor`.
const soft = { fill: 'currentColor', fillOpacity: 0.16 } as const;

const PATHS: Record<RpgIconName, ReactNode> = {
  castle: <>
    <path {...soft} d="M4 21V8h2V5h2v3h2V5h4v3h2V5h2v3h2v13z" />
    <path d="M10 21v-4a2 2 0 0 1 4 0v4" />
    <path d="M8 12h.01M16 12h.01" />
  </>,
  sword: <>
    <path {...soft} d="M20 4l-1 5-7 7-4-4 7-7z" />
    <path d="M6.5 12.5l5 5" />
    <path d="M9 15l-4 4" />
    <circle cx="4" cy="20" r="1" />
  </>,
  tome: <>
    <path {...soft} d="M5 3h13v17H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3" />
    <path d="M7 3v13M4 17a2 2 0 0 1 3-1h11M7 20h12M10 5h5M10 14h5" />
    <path d="m12.5 7 2.5 3-2.5 3-2.5-3z" />
  </>,
  shield: <>
    <path {...soft} d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z" />
    <path d="M12 8v7M9 11h6" />
  </>,
  helm: <>
    <path {...soft} d="M5 18V10a7 7 0 0 1 14 0v8l-5 3v-7h-4v7z" />
    <path d="M12 3v8M5 11l5 3M19 11l-5 3M7 8l2 2M17 8l-2 2" />
  </>,
  gem: <>
    <path {...soft} d="M12 3.5l7.5 6.5L12 20.5 4.5 10z" />
    <path d="M4.5 10h15M9 10l3-6.5 3 6.5M9 10l3 10.5L15 10" />
  </>,
  orb: <>
    <circle {...soft} cx="12" cy="13" r="7.5" />
    <path d="M8 10.5a5 5 0 0 1 3.5-3" />
    <path d="M19 3v3M17.5 4.5h3" />
  </>,
  lock: <>
    <path {...soft} d="M6 11h12v9H6z" />
    <path d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3M12 14.5v2" />
  </>,
  scroll: <>
    <path {...soft} d="M8 4h11v13a3 3 0 0 1-3 3H6a3 3 0 0 0 3-3V6a2 2 0 0 0-1-2z" />
    <path d="M8 4a2 2 0 0 0-2 2v1h3M11 9h5M11 12h5" />
  </>,
  satchel: <>
    <path {...soft} d="M6 9a6 6 0 0 1 12 0v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z" />
    <path d="M9 13h6v4H9zM9 3.5V6M15 3.5V6" />
  </>,
  trophy: <>
    <path {...soft} d="M8 4h8v5a4 4 0 0 1-8 0z" />
    <path d="M8 6H5v2a3 3 0 0 0 3 3M16 6h3v2a3 3 0 0 1-3 3M12 13v4M9 20h6M10 17h4" />
  </>,
  medal: <>
    <circle {...soft} cx="12" cy="14.5" r="5.5" />
    <path d="M8.5 3.5L12 9l3.5-5.5M12 12l.9 1.8 2 .3-1.4 1.4.3 2-1.8-1-1.8 1 .3-2-1.4-1.4 2-.3z" />
  </>,
  map: <>
    <path {...soft} d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" />
    <path d="M9 4v14M15 6v14" />
  </>,
  flame: <path {...soft} d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z" />,
  star: <path {...soft} d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z" />,
  quill: <>
    <path {...soft} d="M20 4c-8 0-13 5-13 12l3 1c7 0 10-6 10-13z" />
    <path d="M4 21l6-8M10 17H7" />
  </>,
  crown: <>
    <path {...soft} d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" />
    <path d="M5 19h14" />
  </>,
  chest: <>
    <path {...soft} d="M3 10a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7v10H3z" />
    <path d="M3 11h18M7 4v7M17 4v7M7 15v5M17 15v5M10 10h4v5h-4zM12 12v1" />
  </>,
  eye: <><path {...soft} d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /><path d="M12 2v1M12 21v1" /></>,
  compass: <><circle {...soft} cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5zM12 3v2M12 19v2M3 12h2M19 12h2" /></>,
  moon: <><path {...soft} d="M19 15A8 8 0 0 1 9 5a8.5 8.5 0 1 0 10 10z" /><path d="M17 3v4M15 5h4M20 8v2M19 9h2" /></>,
  spark: <><path {...soft} d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z" /><path d="M5 3v3M3.5 4.5h3M19 18v3M17.5 19.5h3" /></>,
  tree: <><path {...soft} d="M12 3c-4 0-6 3-5 5-5 3-3 8 1 8h8c4 0 6-5 1-8 1-2-1-5-5-5z" /><path d="M12 9v12M8 12l4 3 4-3M9 21h6" /></>,
  hourglass: <><path {...soft} d="M6 3h12v3c0 3-4 4-4 6s4 3 4 6v3H6v-3c0-3 4-4 4-6S6 9 6 6z" /><path d="M5 3h14M5 21h14M8 6h8M9 18l3-3 3 3" /></>,
  mirror: <><ellipse {...soft} cx="12" cy="9" rx="6" ry="7" /><path d="M10 16v6h4v-6M9 6l4-2M10 10l5-3" /></>,
  wings: <><path {...soft} d="M11 18C3 18 2 9 3 4l8 8M13 18c8 0 9-9 8-14l-8 8" /><path d="M4 9l5 4M5 14l4 2M20 9l-5 4M19 14l-4 2M12 10v11" /></>,
};

interface RpgIconProps {
  name: RpgIconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function RpgIcon({ name, size = 24, strokeWidth = 1.7, className }: RpgIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {PATHS[name]}
    </svg>
  );
}
