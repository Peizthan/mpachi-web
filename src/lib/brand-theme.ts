import tokens from "../../brand/brand-tokens.json";

type ColorToken = keyof typeof tokens.color;
type SpaceToken = keyof typeof tokens.space;

type RadiusToken = keyof typeof tokens.radius;

export const brandTokens = tokens;

export const brandTheme = {
  ...tokens,
  focusOutline: tokens.color.accentYellow,
  buttonPrimary: {
    background: tokens.color.accentYellow,
    color: tokens.color.inkNavy,
    paddingY: tokens.space.sm,
    paddingX: tokens.space.md,
    radius: tokens.radius.soft,
  },
  buttonSecondary: {
    background: tokens.color.accentCoral,
    color: "#FFFFFF",
    paddingY: tokens.space.sm,
    paddingX: tokens.space.md,
    radius: tokens.radius.soft,
  },
} as const;

export const getColorToken = (token: ColorToken) => tokens.color[token];

export const getSpaceToken = (token: SpaceToken) => tokens.space[token];

export const getRadiusToken = (token: RadiusToken) => tokens.radius[token];
