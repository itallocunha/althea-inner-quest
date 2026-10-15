import { CharacterClass, OrbId, Race } from '@/types/game';

// All artwork lives in `public/art/`, generated from the raw files in `imagens/` by `npm run art`.
const art = (path: string) => `${import.meta.env.BASE_URL}art/${path}`;

const ORB_IDS: OrbId[] = ['blue', 'green', 'purple', 'red', 'yellow'];
const byOrb = <T,>(build: (orb: OrbId) => T): Record<OrbId, T> =>
  Object.fromEntries(ORB_IDS.map(orb => [orb, build(orb)])) as Record<OrbId, T>;

/** Orb illustration with a transparent background. */
export const ORB_ART = byOrb(orb => art(`orbs/${orb}/orb.webp`));
/** Orb illustration on its own scenery. */
export const ORB_SCENE_ART = byOrb(orb => art(`orbs/${orb}/with-bg.webp`));
/** Banner with the orb's guiding question ("Onde eu estou?"). */
export const ORB_TITLE_ART = byOrb(orb => art(`orbs/${orb}/title.webp`));
export const ORB_STORY_ART = byOrb(orb => art(`orbs/${orb}/story.webp`));
export const ORB_REWARD_ART = byOrb(orb => art(`orbs/${orb}/reward.webp`));
/** Milestone banners: the first is shown at half of the orb, the second when it is complete. */
export const ORB_LEVEL_ART = byOrb((orb): [string, string] => [art(`orbs/${orb}/level-1.webp`), art(`orbs/${orb}/level-2.webp`)]);
/** Territory map for each orb, and the whole world map. */
export const ORB_CONTINENT_ART = byOrb(orb => art(`continents/${orb}.webp`));
export const WORLD_MAP_ART = art('continents/all.webp');
/** The Atlas planet reuses the world scenery; magical orb artwork stays inside the world. */
export const ATLAS_ART = { fiveOrbsSurface: WORLD_MAP_ART };
/** Printable character sheet for each orb. */
export const ORB_SHEET_ART = byOrb(orb => art(`sheets/${orb}.webp`));
/** Lauro in front of each orb. */
export const ORB_BACKGROUND_ART = byOrb(orb => art(`backgrounds/lauro-${orb}.webp`));
/** Short loops of Lauro charging an orb; only some orbs have one so far. */
export const ORB_VIDEO: Partial<Record<OrbId, string>> = {
  blue: art('videos/lauro-blue.mp4'),
  green: art('videos/lauro-green.mp4'),
  purple: art('videos/lauro-purple.mp4'),
};
/** Final banners, only delivered for the last orb. */
export const JOURNEY_FINALE_ART = {
  victory: art('orbs/yellow/victory.webp'),
  end: art('orbs/yellow/journey-end.webp'),
};

export const CHARACTER_ART = {
  action: art('lauro/pose-logo.webp'),
  mage: art('lauro/serious.webp'),
  channeling: art('lauro/channeling.webp'),
  channelingAlt: art('lauro/channeling-2.webp'),
  logoPose: art('lauro/pose-logo-alt.webp'),
  render3d: art('lauro/3d.webp'),
};

export const BACKGROUND_ART = {
  allOrbs: art('backgrounds/lauro-all-orbs.webp'),
  charging: art('backgrounds/lauro-charging.webp'),
  empty: art('backgrounds/lauro-empty.webp'),
  logoPulse: art('backgrounds/logo-pulse.webp'),
};

export const LOGO_ART = { title: art('logo/title.webp'), full: art('logo/full.webp') };
export const LOGO_VIDEO = art('videos/logo-orbs.mp4');
export const POWER_VIDEO = art('videos/lauro-power.mp4');

const traitArt = (folder: string, key: string) => ({
  /** 2:3 poster used in pickers. */
  cover: art(`${folder}/${key}/cover.webp`),
  /** Full collectible card. */
  card: art(`${folder}/${key}/card.webp`),
  /** 16:9 banner with the name. */
  banner: art(`${folder}/${key}/banner.webp`),
});

const RACES: Race[] = ['human', 'elf', 'dwarf', 'draconian', 'fairy', 'orc'];
const CLASSES: CharacterClass[] = ['paladin', 'mage', 'warrior', 'archer', 'rogue'];

export const RACE_ART = Object.fromEntries(RACES.map(race => [race, traitArt('races', race)])) as Record<Race, ReturnType<typeof traitArt>>;
export const CLASS_ART = Object.fromEntries(CLASSES.map(cls => [cls, traitArt('classes', cls)])) as Record<CharacterClass, ReturnType<typeof traitArt>>;

/** Banner for a challenge, with its title baked into the artwork. Challenge ids are b1..b10, g1.., p1.., r1.., y1... */
export const getChallengeArt = (challengeId: string) => art(`challenges/${challengeId}.webp`);

// Medals are only illustrated for the first orb so far.
const MEDAL_ART_ORBS: OrbId[] = ['blue'];
export const getMedalArt = (orbId: OrbId, challengeId: string): string | undefined =>
  MEDAL_ART_ORBS.includes(orbId) ? art(`medals/${challengeId}.webp`) : undefined;
