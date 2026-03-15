// ─── Shared Response Envelope ────────────────────────────────────────────────
// All backend responses follow: { success: boolean, data?: T, error?: string | object }

export interface ApiError {
  message: string;
  code?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string | ApiError;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

/** Uppercase to match backend enum: user_role { VOTER EC } */
export type UserRole = 'VOTER' | 'EC';

export interface AuthUser {
  id: string;           // UUID
  nationalId: string;
  title: string;        // e.g. นาย, นาง, นางสาว
  firstName: string;
  lastName: string;
  role: UserRole;
  constituencyId?: number;
  address?: string;
}

export interface AuthAdmin {
  id: number;
  username: string;
}

/** Shape returned by login / register endpoints */
export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: AuthUser;
  admin?: AuthAdmin;
  error?: string | ApiError;
}

/** Specific shape for GET /api/auth/me */
export interface AuthMeResponse {
  success: boolean;
  user?: AuthUser;
  error?: string | ApiError;
}

export interface RegisterUserPayload {
  nationalId: string;   // exactly 13 digits
  password: string;     // min 6 chars
  title: string;
  firstName: string;
  lastName: string;
  address: string;
  constituencyId: number;
  role?: UserRole;      // defaults to 'VOTER' on backend
}

export interface LoginPayload {
  nationalId: string;
  password: string;
}

export interface AdminRegisterPayload {
  username: string;     // 3-50 chars, alphanumeric + _ -
  password: string;     // min 8 chars, must contain uppercase + number
}

export interface AdminLoginPayload {
  username: string;
  password: string;
}

// ─── Constituency ─────────────────────────────────────────────────────────────

export interface Constituency {
  id: number;
  province: string;
  district_number: number;
  is_closed: boolean;
}

// ─── Candidate (as returned inside constituency results) ──────────────────────

export interface CandidateResult {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  number: number;
  image_url: string;
  party_id: number;
  party_name: string;
  party_logo_url: string;
  /** 0 when constituency is open, real count when closed */
  vote_count: number;
  province: string;
  district_number: number;
  is_closed: boolean;
  constituency?: {
    is_closed: boolean;
    province: string;
    district_number: number;
  };
}

export interface ConstituencyResults {
  constituency: Constituency;
  candidates: CandidateResult[];
}

// ─── Party ───────────────────────────────────────────────────────────────────

export interface Party {
  id: number;
  name: string;
  logo_url: string;
}

export interface PartyCandidate {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  number: number;
  image_url: string;
  province: string;
  district_number: number;
}

export interface PartyDetails {
  id: number;
  name: string;
  logo_url: string;
  policy: string;
  created_at: string;
  candidates: PartyCandidate[];
}

export interface PartyOverviewItem {
  id: number;
  name: string;
  logoUrl: string;
  seats: number;
}

export interface PartyOverview {
  totalSeats: number;
  closedConstituencies: number;
  parties: PartyOverviewItem[];
}

// ─── EC (Election Commission) ────────────────────────────────────────────────

export interface CloseVotingPayload {
  /** true = close voting, false = reopen voting */
  isClosed: boolean;
}

export interface DeclareResultsWinner {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  number: number;
  party_name: string;
  party_logo_url: string;
  vote_count: number;
}

export interface ConstituencyWinner {
  id: number;
  province: string;
  district_number: number;
  total_votes: number;
  winner: DeclareResultsWinner;
}

// ─── Voting ──────────────────────────────────────────────────────────────────

export interface VotePayload {
  userId: string;
  candidateId: number | null;
  constituencyId: number;
}
