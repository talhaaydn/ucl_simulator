export interface Team {
  id: number;
  name: string;
  logo: string;
  standings?: Standing[];
} 

export interface Standing {
  id: number;
  played: number;
  won: number;
  draw: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  points: number;
}

export interface Fixture {
  id: number;
  name: string;
  activeWeek: number;
  isCompleted: boolean;
} 

export interface Group {
  id: number;
  name: string;
  teams: Team[];
} 

export interface Game {
  id: number;
  week: number;
  stage: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  isPlayed: boolean;
}