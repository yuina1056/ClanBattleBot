export interface LapConfigType {
  2: number;
  3: number;
  4: number;
  [key: number]: number;
}
export interface LapConfig {
  bossLap: LapConfigType;
}

export const LapConfig = {
  bossLap: {
    2: 1,
    3: 7,
    4: 23,
  },
};
export interface BossHPConfigType {
  2: number;
  3: number;
  4: number;
  [key: number]: number;
}

export interface BossHPConfig {
  boss1HP: BossHPConfigType;
  boss2HP: BossHPConfigType;
  boss3HP: BossHPConfigType;
  boss4HP: BossHPConfigType;
  boss5HP: BossHPConfigType;
}

export const BossHPConfig: BossHPConfig = {
  boss1HP: {
    2: 1200,
    3: 3500,
    4: 70000,
  },
  boss2HP: {
    2: 1500,
    3: 4000,
    4: 72000,
  },
  boss3HP: {
    2: 2000,
    3: 4000,
    4: 76000,
  },
  boss4HP: {
    2: 2300,
    3: 5000,
    4: 78000,
  },
  boss5HP: {
    2: 3000,
    3: 5800,
    4: 80000,
  },
};

export default {
  LapConfig,
  BossHPConfig,
};
