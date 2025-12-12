import { CarData, Driver, Lap, Position, RaceControl, Session, Stint, TrackLocation, Pit, Interval, TeamRadio, Overtake, Weather } from '@/types/openf1';

const BASE_URL = 'https://api.openf1.org/v1';

let lastFetchTime = 0;
// Queue to serialize requests
let requestQueue = Promise.resolve<any>(null);
const MIN_REQUEST_INTERVAL = 200; // 200ms spacing = 5 req/sec max

async function fetchOpenF1<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T[]> {
    // Chain onto the queue
    const result = requestQueue.then(async () => {
        const now = Date.now();
        const elapsed = now - lastFetchTime;
        if (elapsed < MIN_REQUEST_INTERVAL) {
            await new Promise(res => setTimeout(res, MIN_REQUEST_INTERVAL - elapsed));
        }
        lastFetchTime = Date.now();

        const url = new URL(`${BASE_URL}${endpoint}`);
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, String(value));
        });

        const maxRetries = 3;
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const res = await fetch(url.toString(), { next: { revalidate: 60 } });
                if (res.ok) {
                    return await res.json();
                }
                if (res.status === 429 && attempt < maxRetries - 1) {
                    const retryAfter = res.headers.get('Retry-After');
                    const delay = retryAfter ? parseInt(retryAfter) * 1000 : 1000 * (attempt + 1);
                    await new Promise(r => setTimeout(r, delay));
                    continue;
                }
                console.error(`Failed to fetch ${url.toString()}: Status ${res.status}`);
                return [];
            } catch (error) {
                console.error(`Error fetching OpenF1 data from ${url.toString()}:`, error);
                if (attempt < maxRetries - 1) {
                    await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
                    continue;
                }
                return [];
            }
        }
        return [];
    });

    // Ensure queue always proceeds even if this request fails
    requestQueue = result.catch(() => null);

    return result;
}

export const openF1 = {
    getSessions: async (year: number = new Date().getFullYear(), type: string = 'Race') => {
        return fetchOpenF1<Session>('/sessions', { year, session_type: type });
    },

    getLatestSession: async (): Promise<Session | null> => {
        // Fetch recent sessions and pick the last one
        const currentYear = new Date().getFullYear();
        const sessions = await fetchOpenF1<Session>('/sessions', { year: currentYear, session_type: 'Race' });

        if (sessions.length > 0) {
            // Ensure strict chronological order
            sessions.sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime());
            return sessions[sessions.length - 1];
        }

        // Fallback to previous year if current year empty (e.g. early season)
        const lastYearSessions = await fetchOpenF1<Session>('/sessions', { year: currentYear - 1, session_type: 'Race' });
        if (lastYearSessions.length > 0) {
            lastYearSessions.sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime());
            return lastYearSessions[lastYearSessions.length - 1];
        }

        return null;
    },

    getDrivers: async (sessionKey: number) => {
        return fetchOpenF1<Driver>('/drivers', { session_key: sessionKey });
    },

    getLaps: async (sessionKey: number, driverNumber?: number) => {
        const params: Record<string, number> = { session_key: sessionKey };
        if (driverNumber) params.driver_number = driverNumber;
        return fetchOpenF1<Lap>('/laps', params);
    },

    getPositions: async (sessionKey: number, driverNumber?: number) => {
        const params: Record<string, number> = { session_key: sessionKey };
        if (driverNumber) params.driver_number = driverNumber;
        return fetchOpenF1<Position>('/position', params);
    },

    getCarData: async (sessionKey: number, driverNumber: number, dateStart?: string, dateEnd?: string) => {
        const params: Record<string, string | number> = { session_key: sessionKey, driver_number: driverNumber };
        if (dateStart) params.date_start = dateStart;
        if (dateEnd) params.date_end = dateEnd;
        return fetchOpenF1<CarData>('/car_data', params);
    },

    getStints: async (sessionKey: number, driverNumber?: number) => {
        const params: Record<string, number> = { session_key: sessionKey };
        if (driverNumber) params.driver_number = driverNumber;
        return fetchOpenF1<Stint>('/stints', params);
    },

    getRaceControl: async (sessionKey: number) => {
        return fetchOpenF1<RaceControl>('/race_control', { session_key: sessionKey });
    },

    getLocations: async (sessionKey: number, driverNumber?: number, dateStart?: string, dateEnd?: string) => {
        const params: Record<string, string | number> = { session_key: sessionKey };
        if (driverNumber) params.driver_number = driverNumber;
        if (dateStart) params.date_start = dateStart;
        if (dateEnd) params.date_end = dateEnd;
        return fetchOpenF1<TrackLocation>('/location', params);
    },

    getPits: async (sessionKey: number, driverNumber?: number) => {
        const params: Record<string, string | number> = { session_key: sessionKey };
        if (driverNumber) params.driver_number = driverNumber;
        return fetchOpenF1<Pit>('/pit', params);
    },

    getIntervals: async (sessionKey: number, driverNumber?: number) => {
        const params: Record<string, string | number> = { session_key: sessionKey };
        if (driverNumber) params.driver_number = driverNumber;
        return fetchOpenF1<Interval>('/intervals', params);
    },

    getTeamRadio: async (sessionKey: number, driverNumber?: number) => {
        const params: Record<string, string | number> = { session_key: sessionKey };
        if (driverNumber) params.driver_number = driverNumber;
        return fetchOpenF1<TeamRadio>('/team_radio', params);
    },

    getOvertakes: async (sessionKey: number, driverNumber?: number) => {
        const params: Record<string, string | number> = { session_key: sessionKey };
        // API supports filtering by overtaking or overtaken, but for now we'll just fetch by overtaking if simpler, 
        // OR we might want to fetch all and filter client side. The simplified API wrapper:
        // If driverNumber provided, we assume we want where THEY overtook.
        if (driverNumber) params.overtaking_driver_number = driverNumber;
        return fetchOpenF1<Overtake>('/overtakes', params);
    },

    getWeather: async (sessionKey: number) => {
        return fetchOpenF1<Weather>('/weather', { session_key: sessionKey });
    }
};
