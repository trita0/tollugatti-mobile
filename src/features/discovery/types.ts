export type GameSummary = {
  id: string;
  name: string;
  handle: string;
  description?: string;
  min_players?: number;
  max_players?: number;
  category?: string;
};

export type EventSummary = {
  id: string;
  title: string;
  description?: string;
  event_type?: string;
  venue_mode?: string;
  start_time?: string;
  end_time?: string;
  status?: string;
  tournaments?: {
    id: string;
    name: string;
    format?: string;
    max_participants?: number;
  };
};

export type TournamentSummary = {
  id: string;
  name: string;
  format?: string;
  max_participants?: number;
  start_time?: string;
  status?: string;
  games?: {
    name?: string;
    handle?: string;
  };
  host_profiles?: {
    organization_name?: string;
  };
};

export type FeaturedPayload = {
  games: GameSummary[];
  tournaments: TournamentSummary[];
  events: EventSummary[];
};

