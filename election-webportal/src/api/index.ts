// Central export for all API modules and shared types.
// Import from here in page/component files:
//   import { authApi, partiesApi } from '../api';
//   import type { Party, Candidate } from '../api';

export { authApi } from './auth';
export { districtsApi } from './districts';
export { partiesApi } from './parties';
export { candidatesApi } from './candidates';
export { ballotsApi } from './ballots';
export { resultsApi } from './results';
export { usersApi } from './users';
export { apiClient } from './client';

export type {
  // Envelope
  ApiResponse,
  PaginatedResponse,
  ApiError,
  // Auth
  UserRole,
  User,
  AuthTokens,
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  // District
  District,
  CreateDistrictPayload,
  UpdateDistrictPayload,
  // Party
  Party,
  CandidateSummary,
  CreatePartyPayload,
  UpdatePartyPayload,
  // Candidate
  Candidate,
  CreateCandidatePayload,
  UpdateCandidatePayload,
  // Ballot
  BallotStatus,
  Ballot,
  CreateBallotPayload,
  CastVotePayload,
  // Results
  CandidateResult,
  DistrictResult,
  // Users
  UserStatus,
  UpdateUserRolePayload,
  UpdateUserStatusPayload,
} from './types';
