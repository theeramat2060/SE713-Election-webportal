// Central export for all API modules and shared types.
// Import from here in page/component files:
//   import { authApi, partiesApi, constituenciesApi, ecApi, electionApi } from '../api';
//   import type { Party, Constituency } from '../api';

export { authApi } from './auth';
export { partiesApi } from './parties';
export { constituenciesApi } from './constituencies';
export { candidatesApi } from './candidates';
export { ecApi } from './ec';
export { electionApi } from './election';
export { voterApi } from './voter';
export { adminApi } from './admin';
export { apiClient } from './client';

export type {
  // Envelope
  ApiResponse,
  // Auth
  UserRole,
  AuthUser,
  AuthAdmin,
  AuthResponse,
  RegisterUserPayload,
  LoginPayload,
  AdminRegisterPayload,
  AdminLoginPayload,
  // Constituency
  Constituency,
  CandidateResult,
  ConstituencyResults,
  // Party
  Party,
  PartyCandidate,
  PartyDetails,
  PartyOverviewItem,
  PartyOverview,
  // EC
  CloseVotingPayload,
  UpdateVotingPayload,
  DeclareResultsWinner,
  ConstituencyWinner,
  // Voting
  VotePayload,
} from './types';
