# Backend REST API Specification

This document defines the REST API endpoints for the Election Web Portal backend, following industry best practices and the `rest-api-design` skill guidelines.

## Base URL
`https://api.election-portal.gov.th/v1`

## Shared Response Envelope
All responses return a JSON object with the following structure:

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

In case of error:
```json
{
  "success": false,
  "data": null,
  "error": "Error message description"
}
```

---

## 1. Authentication & Authorization

### Register User (Voter/EC)
`POST /auth/register`
- **Description:** Registers a new voter or EC official.
- **Payload:** `RegisterUserPayload`
- **Success Response:** `201 Created` with `AuthResponse` (token + user).

### Login User (Voter/EC)
`POST /auth/login`
- **Description:** Login for voters or EC officials.
- **Payload:** `LoginPayload`
- **Success Response:** `200 OK` with `AuthResponse`.

### Register Admin
`POST /auth/admin/register`
- **Description:** Registers a new system administrator.
- **Payload:** `AdminRegisterPayload`
- **Success Response:** `201 Created` with `AuthResponse`.

### Login Admin
`POST /auth/admin/login`
- **Description:** Login for system administrators.
- **Payload:** `AdminLoginPayload`
- **Success Response:** `200 OK` with `AuthResponse`.

---

## 2. Public Resources

### List All Parties
`GET /public/parties`
- **Description:** Retrieves a list of all participating political parties.
- **Success Response:** `200 OK` with `ApiResponse<Party[]>`.

### Get Party Details
`GET /public/parties/{id}`
- **Description:** Retrieves detailed information about a party, including its candidates.
- **Success Response:** `200 OK` with `ApiResponse<PartyDetails>`.

### List All Constituencies
`GET /public/constituencies`
- **Description:** Retrieves a list of all election constituencies.
- **Success Response:** `200 OK` with `ApiResponse<Constituency[]>`.

### Get Constituency Results
`GET /public/constituencies/{id}/results`
- **Description:** Retrieves candidates and vote counts for a constituency. 
- **Note:** Vote counts are 0 if the constituency is open.
- **Success Response:** `200 OK` with `ApiResponse<ConstituencyResults>`.

### Get Election Overview
`GET /public/election/overview`
- **Description:** Aggregated seat counts and election status.
- **Success Response:** `200 OK` with `ApiResponse<PartyOverview>`.

---

## 3. Election Commission (EC) Operations
*Requires `EC` role (Bearer Token)*

### List Open Constituencies
`GET /ec/constituencies/open`
- **Description:** List all constituencies where voting is currently open.
- **Success Response:** `200 OK` with `ApiResponse<Constituency[]>`.

### Set Voting Status
`POST /ec/voting/status`
- **Description:** Globally opens or closes voting.
- **Payload:** `{ "isClosed": boolean }`
- **Success Response:** `200 OK`.

### Declare Election Results
`POST /ec/election/declare-results`
- **Description:** Finalizes votes and calculates winners for all closed constituencies.
- **Success Response:** `200 OK` with `ApiResponse<ConstituencyWinner[]>`.

---

## 4. Voting Operations
*Requires `VOTER` role (Bearer Token)*

### Cast Vote
`POST /voter/vote`
- **Description:** Casts a vote for a candidate in the voter's constituency.
- **Payload:** `{ "candidateId": number | "abstain" }`
- **Success Response:** `201 Created`.
- **Errors:** `403 Forbidden` if user has already voted or constituency is closed.

---

## 5. Admin Operations
*Requires `ADMIN` role (Bearer Token)*

### List All Users
`GET /admin/users`
- **Description:** Retrieves a paginated list of all users.
- **Query Params:** `role`, `search`, `page`, `limit`.
- **Success Response:** `200 OK` with `ApiResponse<User[]>`.

### Toggle User Status
`PATCH /admin/users/{id}/status`
- **Description:** Activates or deactivates a user account.
- **Payload:** `{ "active": boolean }`
- **Success Response:** `200 OK`.

---

## HTTP Status Codes Mapping

| Code | Meaning | Usage |
|---|---|---|
| `200` | OK | Successful GET, PUT, PATCH, or non-creation POST. |
| `201` | Created | Successful POST resulting in a new resource. |
| `400` | Bad Request | Validation errors or malformed request. |
| `401` | Unauthorized | Missing or invalid authentication token. |
| `403` | Forbidden | Authenticated user lacks permission for the resource. |
| `404` | Not Found | Resource does not exist. |
| `429` | Too Many Requests | Rate limit exceeded. |
| `500` | Internal Server Error | Unexpected server-side error. |
