import { HOUSE_HRID_TO_KEY, type HouseKey } from "./houses";

export type ImportedHouseLevels = Partial<Record<HouseKey, number>>;

type Root = {
    houseRooms?: Record<string, number>;
    player?: {
        houseRooms?: Record<string, number>;
    };
};

export function parseHouseRoomsFromImport(jsonText: string): ImportedHouseLevels {
    const data = JSON.parse(jsonText) as Root;

    const houseRooms = data.houseRooms ?? data.player?.houseRooms;

    if (!houseRooms || typeof houseRooms !== "object") return {};

    const out: ImportedHouseLevels = {};

    for (const [hrid, level] of Object.entries(houseRooms)) {
        const key = HOUSE_HRID_TO_KEY[hrid];
        if (!key) continue;           // not mapped yet
        if (typeof level !== "number") continue;

        out[key] = level;
    }

    return out;
}
