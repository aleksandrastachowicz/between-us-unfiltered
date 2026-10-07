import love from '@/assets/card-textures/love.webp';
import friendship from '@/assets/card-textures/friendship.webp';
import selfdev from '@/assets/card-textures/selfdev.webp';
import passions from '@/assets/card-textures/passions.webp';
import introspection from '@/assets/card-textures/introspection.webp';
import plusLove from '@/assets/card-textures/plus_love.webp';
import plusSpice from '@/assets/card-textures/plus_spice.webp';
import plusDeep from '@/assets/card-textures/plus_deep.webp';
import plusKinky from '@/assets/card-textures/plus_kinky.webp';
import ufLoveSpice from '@/assets/card-textures/uf_love_spice.webp';
import ufAfterDark from '@/assets/card-textures/uf_after_dark.webp';
import ufNoLimits from '@/assets/card-textures/uf_no_limits.webp';

// Vite fingerprints these immutable textures; every instance shares a browser cache entry.
export const CARD_TEXTURES = {
  love, friendship, selfdev, passions, introspection,
  plus_love: plusLove, plus_spice: plusSpice, plus_deep: plusDeep, plus_kinky: plusKinky,
  uf_love_spice: ufLoveSpice, uf_after_dark: ufAfterDark, uf_no_limits: ufNoLimits,
};