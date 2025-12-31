export type MarketEntry = {
    a: number; // ask
    b: number; // bid
};

export type MarketplaceResponse = {
    marketData: Record<
        string, // item hrid, e.g. "/items/abyssal_essence"
        Record<
            string, // enhancement level as string ("0", "1", etc)
            MarketEntry
        >
    >;
};
