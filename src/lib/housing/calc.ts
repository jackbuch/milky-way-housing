import { COSTS, type LevelCost } from "./costs";
import type { MaterialId } from "./materials";
import type { HouseKey } from "./houses";

export function calcMaterials(
    house: HouseKey,
    current: number,
    target: number
): LevelCost {
    if (target <= current) return {};

    const totals: Partial<Record<MaterialId, number>> = {};

    const table = COSTS[house];
    if (!table) return {};

    for (let lvl = current + 1; lvl <= target; lvl++) {
        const cost = table[lvl];
        if (!cost) continue;

        for (const [mat, amt] of Object.entries(cost) as [MaterialId, number][]) {
            totals[mat] = (totals[mat] ?? 0) + (amt ?? 0);
        }
    }

    return Object.fromEntries(
        Object.entries(totals).filter(([, v]) => (v ?? 0) > 0)
    ) as LevelCost;
}

export function mergeCosts(costs: LevelCost[]): LevelCost {
    const out: Partial<Record<MaterialId, number>> = {};

    for (const c of costs) {
        for (const [k, v] of Object.entries(c) as [MaterialId, number][]) {
            out[k] = (out[k] ?? 0) + (v ?? 0);
        }
    }

    return out as LevelCost;
}
