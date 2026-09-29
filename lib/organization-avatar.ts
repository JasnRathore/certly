import { randomBytes, randomInt } from "node:crypto";
import { db } from "@/lib/db";

const organizationAvatarStyles = ["blob", "squircle", "waves", "planets"] as const;

const palettes = [
  ["#172554", "#60A5FA", "#BFDBFE"],
  ["#4A1942", "#E879F9", "#F5D0FE"],
  ["#064E3B", "#34D399", "#A7F3D0"],
  ["#7C2D12", "#FB923C", "#FED7AA"],
  ["#312E81", "#A78BFA", "#DDD6FE"],
  ["#164E63", "#22D3EE", "#A5F3FC"],
] as const;

export type OrganizationAvatarStyle = (typeof organizationAvatarStyles)[number];

export type OrganizationAvatarConfig = {
  style: OrganizationAvatarStyle;
  seed: string;
  palette: number;
};

export function createRandomOrganizationAvatarConfig(): OrganizationAvatarConfig {
  return {
    style: organizationAvatarStyles[randomInt(organizationAvatarStyles.length)],
    seed: randomBytes(4).toString("hex"),
    palette: randomInt(palettes.length),
  };
}

export function parseOrganizationAvatarConfig(value: string): OrganizationAvatarConfig {
  const parsed: unknown = JSON.parse(value);
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("style" in parsed) ||
    !organizationAvatarStyles.includes(parsed.style as OrganizationAvatarStyle) ||
    !("seed" in parsed) ||
    typeof parsed.seed !== "string" ||
    !("palette" in parsed) ||
    typeof parsed.palette !== "number" ||
    !Number.isInteger(parsed.palette) ||
    parsed.palette < 0 ||
    parsed.palette >= palettes.length
  ) {
    throw new Error("Invalid organization avatar configuration");
  }

  return parsed as OrganizationAvatarConfig;
}

function seededRandom(seed: string) {
  let state = Number.parseInt(seed, 16) >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function createOrganizationAvatarDataUri(config: OrganizationAvatarConfig) {
  const [background, primary, secondary] = palettes[config.palette];
  const random = seededRandom(config.seed);
  let artwork: string;

  switch (config.style) {
    case "blob":
      artwork = `
        <path d="M23 61C16 43 29 23 49 19c15-3 24 8 39 8 20 0 34 14 31 33-3 20-20 20-22 39-2 20-22 25-38 14-13-9-27-4-37-16-9-10-5-24 1-36Z" fill="${primary}"/>
        <circle cx="53" cy="53" r="11" fill="${secondary}" opacity=".88"/>
        <circle cx="91" cy="83" r="7" fill="${secondary}" opacity=".72"/>
        <circle cx="40" cy="91" r="4" fill="${background}" opacity=".8"/>`;
      break;
    case "squircle": {
      const rotation = Math.round(random() * 24 - 12);
      artwork = `
        <rect x="23" y="23" width="66" height="66" rx="24" transform="rotate(${rotation} 56 56)" fill="${primary}"/>
        <rect x="50" y="43" width="53" height="53" rx="19" transform="rotate(-${rotation} 76.5 69.5)" fill="${secondary}" opacity=".9"/>
        <circle cx="42" cy="83" r="7" fill="${background}" opacity=".78"/>`;
      break;
    }
    case "waves": {
      const offset = Math.round(random() * 18);
      artwork = `
        <path d="M0 ${57 + offset}c22-17 41-17 64 0s42 17 64 0v71H0Z" fill="${primary}"/>
        <path d="M0 ${77 - offset / 2}c22-17 41-17 64 0s42 17 64 0v51H0Z" fill="${secondary}" opacity=".88"/>
        <circle cx="91" cy="39" r="11" fill="${secondary}" opacity=".85"/>`;
      break;
    }
    case "planets": {
      const planetX = 47 + Math.round(random() * 28);
      const planetY = 47 + Math.round(random() * 20);
      artwork = `
        <circle cx="25" cy="33" r="2.5" fill="${secondary}"/>
        <circle cx="101" cy="36" r="2" fill="${secondary}"/>
        <circle cx="28" cy="94" r="2" fill="${secondary}"/>
        <circle cx="101" cy="98" r="3" fill="${secondary}"/>
        <ellipse cx="${planetX}" cy="${planetY}" rx="39" ry="15" transform="rotate(-24 ${planetX} ${planetY})" fill="none" stroke="${secondary}" stroke-width="7"/>
        <circle cx="${planetX}" cy="${planetY}" r="25" fill="${primary}"/>
        <path d="M${planetX - 15} ${planetY + 7}c9 5 20 5 30 0" fill="none" stroke="${secondary}" stroke-width="4" stroke-linecap="round" opacity=".8"/>`;
      break;
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="32" fill="${background}"/>${artwork}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

let initialization: Promise<void> | undefined;

export function ensureOrganizationAvatars() {
  if (!initialization) {
    initialization = (async () => {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS OrganizationAvatar (
          orgId TEXT PRIMARY KEY,
          config TEXT NOT NULL,
          FOREIGN KEY (orgId) REFERENCES Organization(id) ON DELETE CASCADE
        )
      `);

      const organizations = await db.execute(`
        SELECT o.id
        FROM Organization o
        LEFT JOIN OrganizationAvatar a ON a.orgId = o.id
        WHERE a.orgId IS NULL
      `);

      if (organizations.rows.length > 0) {
        await db.batch(
          organizations.rows.map((organization) => ({
            sql: "INSERT OR IGNORE INTO OrganizationAvatar (orgId, config) VALUES (?, ?)",
            args: [
              organization.id as string,
              JSON.stringify(createRandomOrganizationAvatarConfig()),
            ],
          })),
        );
      }
    })().catch((error: unknown) => {
      initialization = undefined;
      throw error;
    });
  }

  return initialization;
}
