export interface Repository {
  id: number;
  teamId: number | null;
  owner: string;
  name: string;
  fullName: string;
  defaultBranch: string | null;
  private: boolean;
  lastSyncedAt: string | null;
  createdAt: string;
}
