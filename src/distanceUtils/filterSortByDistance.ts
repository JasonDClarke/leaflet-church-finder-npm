import { haversine } from './haversine'

// Utility function to filter and sort an array of locations within 5 miles
export const filterAndSortByDistance = (
    locations: Required<{lat: number, lng: number}>[],
    center: {lat: number, lng: number}
): Required<{lat: number, lng: number}>[] => {
    return locations
        .filter((location) => haversine(center, location) <= 5) // Filter within 5 miles
        .sort((a, b) => haversine(center, a) - haversine(center, b)) // Sort closest first
}

export const sortByDistance = <T extends Required<{lat: number, lng: number}>>(
    locations: T[],
    center: {lat: number, lng: number}
): T[] => {
    return locations.sort((a, b) => haversine(center, a) - haversine(center, b)) // Sort closest first
}
