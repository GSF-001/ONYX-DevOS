export interface IdentityData {
  handle: string;
  developerId: string;
  createdAt: string;
  lastChangedAt: string;
}

export interface CooldownStatus {
  canChange: boolean;
  nextChangeAt: string | null;
}
