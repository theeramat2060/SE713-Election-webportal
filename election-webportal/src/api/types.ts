// ─── Shared API Response Envelope ───────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export type UserRole = 'voter' | 'ec' | 'admin';

export interface User {
  id: string;
  nationalId: string;
  fullName: string;
  role: UserRole;
  districtId?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginPayload {
  nationalId: string;
  password: string;
}

export interface RegisterPayload {
  nationalId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  districtId: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ─── District ────────────────────────────────────────────────────────────────

export interface District {
  id: string;
  name: string;
  province: string;
  voters: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDistrictPayload {
  name: string;
  province: string;
}

export interface UpdateDistrictPayload {
  name?: string;
  province?: string;
}

// ─── Party ───────────────────────────────────────────────────────────────────

export interface CandidateSummary {
  id: string;
  number: number;
  name: string;
  platform: string;
}

export interface Party {
  id: string;
  name: string;
  nameEn: string;
  logo: string;
  leader: string;
  founded: string;
  policy: string;
  candidates: CandidateSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePartyPayload {
  name: string;
  nameEn: string;
  logo?: string;
  leader: string;
  founded: string;
  policy: string;
}

export interface UpdatePartyPayload extends Partial<CreatePartyPayload> {}

// ─── Candidate ───────────────────────────────────────────────────────────────

export interface Candidate {
  id: string;
  number: number;
  name: string;
  party: string;
  partyId: string;
  district: string;
  districtId: string;
  photoUrl: string;
  platform: string;
  partyLogo: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCandidatePayload {
  number: number;
  name: string;
  partyId: string;
  districtId: string;
  photoUrl?: string;
  platform: string;
}

export interface UpdateCandidatePayload extends Partial<CreateCandidatePayload> {}

// ─── Ballot ──────────────────────────────────────────────────────────────────

export type BallotStatus = 'draft' | 'open' | 'closed' | 'tallied';

export interface Ballot {
  id: string;
  districtId: string;
  districtName: string;
  status: BallotStatus;
  openedAt?: string;
  closedAt?: string;
  totalVotes: number;
  eligibleVoters: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBallotPayload {
  districtId: string;
}

export interface CastVotePayload {
  candidateId: string;
}

// ─── Results ─────────────────────────────────────────────────────────────────

export interface CandidateResult {
  rank: number;
  candidateId: string;
  name: string;
  party: string;
  partyLogo: string;
  photoUrl: string;
  votes: number;
  percentage: number;
}

export interface DistrictResult {
  districtId: string;
  districtName: string;
  status: BallotStatus;
  totalVotes: number;
  eligibleVoters: number;
  turnoutPercentage: number;
  candidates: CandidateResult[];
}

// ─── User Management ─────────────────────────────────────────────────────────

export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface UpdateUserRolePayload {
  role: UserRole;
}

export interface UpdateUserStatusPayload {
  status: UserStatus;
}
