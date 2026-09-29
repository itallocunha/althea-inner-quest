import blueOrb from '@/assets/althea/orbe-azul.png.asset.json';
import greenOrb from '@/assets/althea/orbe-verde.png.asset.json';
import purpleOrb from '@/assets/althea/orbe-roxa.png.asset.json';
import redOrb from '@/assets/althea/orbe-vermelha.png.asset.json';
import yellowOrb from '@/assets/althea/orbe-amarela.png.asset.json';
import characterAction from '@/assets/althea/personagem-althea-acao.png.asset.json';
import characterMage from '@/assets/althea/personagem-althea-mago.png.asset.json';
import { OrbId } from '@/types/game';

export const ORB_ART: Record<OrbId, string> = {
  blue: blueOrb.url,
  green: greenOrb.url,
  purple: purpleOrb.url,
  red: redOrb.url,
  yellow: yellowOrb.url,
};

export const CHARACTER_ART = {
  action: characterAction.url,
  mage: characterMage.url,
};