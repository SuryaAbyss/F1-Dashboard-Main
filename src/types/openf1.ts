export interface Session {
  session_key: number;
  meeting_key: number;
  country_code: string;
  circuit_key: number;
  circuit_short_name: string;
  session_type: string;
  date_start: string;
  date_end: string;
  gmt_offset: string;
  session_name: string;
  year: number;
}

export interface Driver {
  session_key: number;
  meeting_key: number;
  broadcast_name: string;
  country_code: string;
  driver_number: number;
  full_name: string;
  headshot_url: string;
  last_name: string;
  name_acronym: string;
  team_colour: string;
  team_name: string;
}

export interface Lap {
  meeting_key: number;
  session_key: number;
  driver_number: number;
  i1_speed: number;
  i2_speed: number;
  st_speed: number;
  date_start: string;
  lap_duration: number;
  is_pit_out_lap: boolean;
  duration_sector_1: number;
  duration_sector_2: number;
  duration_sector_3: number;
  segments_sector_1: number[];
  segments_sector_2: number[];
  segments_sector_3: number[];
  lap_number: number;
}

export interface Position {
  session_key: number;
  meeting_key: number;
  driver_number: number;
  date: string;
  position: number;
}

export interface CarData {
  meeting_key: number;
  session_key: number;
  driver_number: number;
  date: string;
  rpm: number;
  speed: number;
  n_gear: number;
  throttle: number;
  brake: number;
  drs: number;
}

export interface Stint {
  session_key: number;
  meeting_key: number;
  driver_number: number;
  stint_number: number;
  tyre_age_at_start: number;
  compound: 'SOFT' | 'MEDIUM' | 'HARD' | 'INTERMEDIATE' | 'WET';
  lap_start: number;
  lap_end: number;
}

export interface RaceControl {
  session_key: number;
  meeting_key: number;
  date: string;
  category: string;
  message: string;
  lap_number: number;
  flag: string;
}

export interface TrackLocation {
  session_key: number;
  meeting_key: number;
  driver_number: number;
  date: string;
  x: number;
  y: number;
  z: number;
}

export interface Pit {
  session_key: number;
  meeting_key: number;
  date: string;
  driver_number: number;
  lap_number: number;
  pit_duration: number;
}

export interface Interval {
  session_key: number;
  meeting_key: number;
  date: string;
  driver_number: number;
  gap_to_leader: number | null;
  interval: number | null;
}

export interface TeamRadio {
  session_key: number;
  meeting_key: number;
  date: string;
  driver_number: number;
  recording_url: string;
}

export interface Overtake {
  session_key: number;
  meeting_key: number;
  date: string;
  overtaking_driver_number: number;
  overtaken_driver_number: number;
  position: number;
}

export interface Weather {
  session_key: number;
  meeting_key: number;
  date: string;
  air_temperature: number;
  humidity: number;
  pressure: number;
  rainfall: number;
  track_temperature: number;
  wind_direction: number;
  wind_speed: number;
}

