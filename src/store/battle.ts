export interface BattleResult {
  year: number, 
  result: '落选' | '海选' | '八强' | '冠军' | 'Masta' | null,
  end?: boolean,
}

export const battleResults: BattleResult[] = [
  { year: 2012, result: null },
  { year: 2013, result: null },
  { year: 2014, result: null },
  { year: 2015, result: null },
  { year: 2016, result: null },
  { year: 2017, result: null },
  { year: 2018, result: null },
  { year: 2019, result: null },
  { year: 2020, result: null },
  { year: 2021, result: null },
  { year: 2022, result: null },
  { year: 2023, result: null },
];
