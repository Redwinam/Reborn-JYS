import { State } from './index';

export interface Player {
  id: number, 
  name: string,
  email: string,
  anonymous: boolean,
  created_at: string,
  updated_at: string,
  plays: Play[]
}

export interface Play {
  id: number,
  player_id: number,
  state: State
}

