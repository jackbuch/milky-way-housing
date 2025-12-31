import type { MarketplaceResponse } from "./types";

export type MarketPrice = {
    ask: number | null;
    bid: number | null;
};

export type MarketPricesByItem = Record<string, MarketPrice>;

export async function fetchMarketplacePrices(): Promise<MarketPricesByItem> {
    const res = await fetch(
        "https://www.milkywayidle.com/game_data/marketplace.json"
    );

    if (!res.ok) {
        throw new Error("Failed to fetch marketplace data");
    }

    const json = (await res.json()) as MarketplaceResponse;

    const out: MarketPricesByItem = {};

    for (const [itemHrid, levels] of Object.entries(json.marketData)) {
        const lvl0 = levels["0"];
        if (!lvl0) continue;

        out[itemHrid.replace("/items/", "")] = {
            ask: lvl0.a >= 0 ? lvl0.a : null,
            bid: lvl0.b >= 0 ? lvl0.b : null,
        };
    }

    return out;
}
