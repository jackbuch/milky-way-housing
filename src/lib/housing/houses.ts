export const HOUSES = [
    "Dairy Barn",
    "Garden",
    "Log Shed",
    "Forge",
    "Workshop",
    "Sewing Parlor",
    "Kitchen",
    "Brewery",
    "Laboratory",
    "Observatory",
    "Dining Room",
    "Library",
    "Dojo",
    "Armory",
    "Gym",
    "Archery Range",
    "Mystical Study"
] as const;

export type HouseKey = typeof HOUSES[number];

export const HOUSE_HRID_TO_KEY: Record<string, HouseKey> = {
    "/house_rooms/dairy_barn": "Dairy Barn",
    "/house_rooms/garden": "Garden",
    "/house_rooms/log_shed": "Log Shed",
    "/house_rooms/forge": "Forge",
    "/house_rooms/workshop": "Workshop",
    "/house_rooms/sewing_parlor": "Sewing Parlor",
    "/house_rooms/kitchen": "Kitchen",
    "/house_rooms/brewery": "Brewery",
    "/house_rooms/laboratory": "Laboratory",
    "/house_rooms/observatory": "Observatory",
    "/house_rooms/dining_room": "Dining Room",
    "/house_rooms/library": "Library",
    "/house_rooms/dojo": "Dojo",
    "/house_rooms/armory": "Armory",
    "/house_rooms/gym": "Gym",
    "/house_rooms/archery_range": "Archery Range",
    "/house_rooms/mystical_study": "Mystical Study"
};
