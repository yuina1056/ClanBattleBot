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
    2: 800,
    3: 2000,
    4: 27000,
  },
  boss2HP: {
    2: 1000,
    3: 2200,
    4: 28000,
  },
  boss3HP: {
    2: 1300,
    3: 2500,
    4: 30000,
  },
  boss4HP: {
    2: 1500,
    3: 2800,
    4: 31000,
  },
  boss5HP: {
    2: 2000,
    3: 3000,
    4: 32000,
  },
};

export default {
  LapConfig,
  BossHPConfig,
};
