import { createAvatar } from "@dicebear/core";
import * as adventurer from "@dicebear/adventurer";
import * as bottts from "@dicebear/bottts";
import * as lorelei from "@dicebear/lorelei";
import * as thumbs from "@dicebear/thumbs";
import { Avatar as AvatarV10, Style as StyleV10 } from "@dicebear/core-v10";
import clayDefinition from "@dicebear/styles/clay.json" with { type: "json" };

const clayStyle = new StyleV10(clayDefinition);

export const userAvatarStyles = {
  adventurer: { label: "Adventurer", style: adventurer },
  bottts: { label: "Bottts", style: bottts },
  clay: { label: "Clay", style: clayStyle },
  lorelei: { label: "Lorelei", style: lorelei },
  thumbs: { label: "Thumbs", style: thumbs },
} as const;

export type UserAvatarStyle = keyof typeof userAvatarStyles;

export type UserAvatarConfig = {
  style: UserAvatarStyle;
  seed: string;
  backgroundColor: string;
};

export const defaultUserAvatarConfig: UserAvatarConfig = {
  style: "adventurer",
  seed: "certly",
  backgroundColor: "#E9D5FF",
};

export function isUserAvatarConfig(value: unknown): value is UserAvatarConfig {
  if (typeof value !== "object" || value === null) return false;
  const config = value as Record<string, unknown>;
  return (
    typeof config.style === "string" &&
    Object.hasOwn(userAvatarStyles, config.style) &&
    typeof config.seed === "string" &&
    config.seed.length > 0 &&
    config.seed.length <= 48 &&
    typeof config.backgroundColor === "string" &&
    /^#[\da-f]{6}$/i.test(config.backgroundColor)
  );
}

export function createUserAvatarDataUri(config: UserAvatarConfig) {
  const options = {
    seed: config.seed,
    backgroundColor: [config.backgroundColor.slice(1)],
    radius: 50,
    size: 128,
  };

  switch (config.style) {
    case "adventurer":
      return createAvatar(adventurer, options).toDataUri();
    case "bottts":
      return createAvatar(bottts, options).toDataUri();
    case "lorelei":
      return createAvatar(lorelei, options).toDataUri();
    case "thumbs":
      return createAvatar(thumbs, options).toDataUri();
    case "clay":
      return new AvatarV10(clayStyle, {
        seed: config.seed,
        backgroundColor: [config.backgroundColor],
        borderRadius: 50,
        size: 128,
      }).toDataUri();
  }
}
