# Election System - API Reference

Last Updated: 2026-03-20

---

## Table of Contents
1. [Authentication APIs](#authentication-apis)
2. [Voter APIs](#voter-apis)
3. [EC Staff APIs](#ec-staff-apis)
4. [Public APIs](#public-apis)
5. [Test Credentials](#test-credentials)
6. [Error Responses](#error-responses)
7. [Security Notes](#security-notes)

---

## Authentication APIs

### 1. Voter Login

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "nationalId": "1234567890001",
  "password": "voter123"
}
```

**cURL:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "nationalId": "1234567890001",
    "password": "voter123"
  }'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3MThhNWI4Mi0xODI5LTRjZGUtYjk3NC1jMWI2YjZhZTU1MGIiLCJyb2xlIjoiVk9URVIiLCJpYXQiOjE3MDc0NjU2MDAsImV4cCI6MTcwODA3MDQwMH0.signaturehere",
  "user": {
    "id": "718a5b82-1829-4cde-b974-c1b6b6ae550b",
    "nationalId": "1234567890001",
    "title": "Mr.",
    "firstName": "John",
    "lastName": "Voter",
    "address": "123 Main St",
    "constituencyId": 1,
    "role": "VOTER",
    "createdAt": "2026-03-20T00:00:00.000Z"
  }
}
```

**Error Response - Invalid Credentials (400):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

---

### 2. Voter Register

**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "nationalId": "9999999999999",
  "password": "newvoter123",
  "title": "Ms.",
  "firstName": "Jane",
  "lastName": "Doe",
  "address": "456 Oak Ave",
  "constituencyId": 1
}
```

**cURL:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nationalId": "9999999999999",
    "password": "newvoter123",
    "title": "Ms.",
    "firstName": "Jane",
    "lastName": "Doe",
    "address": "456 Oak Ave",
    "constituencyId": 1
  }'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
    "nationalId": "9999999999999",
    "title": "Ms.",
    "firstName": "Jane",
    "lastName": "Doe",
    "address": "456 Oak Ave",
    "constituencyId": 1,
    "role": "VOTER",
    "createdAt": "2026-03-20T15:35:00.000Z"
  }
}
```

**Error Response - Duplicate ID (400):**
```json
{
  "success": false,
  "error": "User with this national ID already exists"
}
```

---

### 3. Admin Login

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "username": "admin_main",
  "password": "password123"
}
```

**cURL:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin_main",
    "password": "password123"
  }'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoxLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3MDc0NjU2MDAsImV4cCI6MTcwODA3MDQwMH0.signaturehere",
  "admin": {
    "id": 1,
    "username": "admin_main",
    "createdAt": "2026-03-20T00:00:00.000Z",
    "role": "ADMIN"
  }
}
```

---

### 4. Get Current User

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**cURL:**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json"
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "718a5b82-1829-4cde-b974-c1b6b6ae550b",
    "nationalId": "1234567890001",
    "title": "Mr.",
    "firstName": "John",
    "lastName": "Voter",
    "address": "123 Main St",
    "constituencyId": 1,
    "role": "VOTER",
    "createdAt": "2026-03-20T00:00:00.000Z"
  }
}
```

---

## Voter APIs

### 1. Cast a Vote

**Endpoint:** `POST /api/voter/vote`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "candidateId": 5
}
```

**cURL:**
```bash
curl -X POST http://localhost:3000/api/voter/vote \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{"candidateId": 5}'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Vote cast successfully",
  "vote": {
    "id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
    "userId": "718a5b82-1829-4cde-b974-c1b6b6ae550b",
    "candidateId": 5,
    "createdAt": "2026-03-20T15:35:00.000Z"
  }
}
```

**Error Response - Already Voted (400):**
```json
{
  "success": false,
  "error": "You have already voted"
}
```

---

### 2. Check My Vote

**Endpoint:** `GET /api/voter/my-vote`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**cURL:**
```bash
curl -X GET http://localhost:3000/api/voter/my-vote \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json"
```

**Response - Has Voted (200 OK):**
```json
{
  "success": true,
  "hasVoted": true,
  "vote": {
    "candidateName": "John Smith",
    "partyName": "Democratic Party",
    "votedAt": "2026-03-20T15:00:00.000Z"
  }
}
```

**Response - Has Not Voted (200 OK):**
```json
{
  "success": true,
  "hasVoted": false
}
```

---

### 3. Get All Candidates

**Endpoint:** `GET /api/voter/get-all-candidate?page=1&pageSize=10`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 10)

**cURL:**
```bash
curl -X GET "http://localhost:3000/api/voter/get-all-candidate?page=1&pageSize=10" \
  -H "Content-Type: application/json"
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Mr.",
      "firstName": "John",
      "lastName": "Smith",
      "number": 1,
      "imageUrl": "candidates/1_photo.jpg",
      "partyId": 1,
      "partyName": "Democratic Party",
      "constituencyId": 1,
      "createdAt": "2026-03-20T00:00:00.000Z"
    },
    {
      "id": 2,
      "title": "Ms.",
      "firstName": "Jane",
      "lastName": "Johnson",
      "number": 2,
      "imageUrl": "candidates/2_photo.jpg",
      "partyId": 2,
      "partyName": "Progressive Alliance",
      "constituencyId": 1,
      "createdAt": "2026-03-20T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 24,
    "totalPages": 3
  }
}
```

---

## EC Staff APIs

### 1. Update Voting Status

**Endpoint:** `POST /api/ec/update-voting`

**Request:**
```json
{
  "isClosed": true
}
```

**cURL - Close Voting:**
```bash
curl -X POST http://localhost:3000/api/ec/update-voting \
  -H "Content-Type: application/json" \
  -d '{"isClosed": true}'
```

**cURL - Open Voting:**
```bash
curl -X POST http://localhost:3000/api/ec/update-voting \
  -H "Content-Type: application/json" \
  -d '{"isClosed": false}'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Voting closed successfully"
}
```

**Alternative Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Voting opened successfully"
}
```

---

### 2. List Open Constituencies

**Endpoint:** `GET /api/ec/open-constituencies`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/ec/open-constituencies \
  -H "Content-Type: application/json"
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "province": "Bangkok",
      "district_number": 1,
      "is_closed": false
    },
    {
      "id": 2,
      "province": "Bangkok",
      "district_number": 2,
      "is_closed": false
    },
    {
      "id": 4,
      "province": "Chiang Mai",
      "district_number": 1,
      "is_closed": false
    }
  ]
}
```

**Response - All Voting Closed (200 OK):**
```json
{
  "success": true,
  "data": []
}
```

---

### 3. Upload Candidate Photo

**Endpoint:** `POST /api/ec/upload`

**Form Data:**
- `photo`: Binary image file

**cURL:**
```bash
curl -X POST http://localhost:3000/api/ec/upload \
  -F "photo=@candidate.jpg"
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "fileKey": "candidates/1_photo.jpg"
}
```

**Error Response - Wrong Field Name (400):**
```json
{
  "success": false,
  "error": "Unexpected field: \"file\". Expected field name: \"photo\". Use: -F \"photo=@yourfile.jpg\""
}
```

**Error Response - No File (400):**
```json
{
  "success": false,
  "error": "No file provided"
}
```

---

### 4. Get Signed URL

**Endpoint:** `GET /api/ec/presignedUrl?key=candidates/1_photo.jpg`

**Query Parameters:**
- `key` (required): File path/key from S3

**cURL:**
```bash
curl -X GET "http://localhost:3000/api/ec/presignedUrl?key=candidates/1_photo.jpg" \
  -H "Content-Type: application/json"
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "signedUrl": "https://qqoywnidyqyoqjalvcpu.storage.supabase.co/storage/v1/s3/candidates/1_photo.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=..."
}
```

**Error Response - Missing Key (400):**
```json
{
  "success": false,
  "error": "Missing required parameter: key"
}
```

---

### 5. Add Candidates

**Endpoint:** `POST /api/ec/AddCandidates`

**Request:**
```json
{
  "title": "Mr.",
  "firstName": "John",
  "lastName": "Smith",
  "number": 1,
  "imageUrl": "candidates/1_photo.jpg",
  "partyId": 1,
  "constituencyId": 1
}
```

**cURL:**
```bash
curl -X POST http://localhost:3000/api/ec/AddCandidates \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mr.",
    "firstName": "John",
    "lastName": "Smith",
    "number": 1,
    "imageUrl": "candidates/1_photo.jpg",
    "partyId": 1,
    "constituencyId": 1
  }'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Candidate added successfully",
  "candidate": {
    "id": 25,
    "title": "Mr.",
    "first_name": "John",
    "last_name": "Smith",
    "number": 1,
    "image_url": "candidates/1_photo.jpg",
    "party_id": 1,
    "constituency_id": 1,
    "created_at": "2026-03-20T15:35:00.000Z"
  }
}
```

**Error Response - Duplicate (400):**
```json
{
  "success": false,
  "error": "Candidate with number 1 already exists in this constituency"
}
```

---

### 6. Declare Results

**Endpoint:** `POST /api/ec/declare-results`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{}
```

**cURL:**
```bash
curl -X POST http://localhost:3000/api/ec/declare-results \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Election results declared successfully",
  "results": {
    "Bangkok": {
      "district_1": {
        "winner": "John Smith (Party A) - 45 votes",
        "candidates": [
          {
            "name": "John Smith",
            "party": "Party A",
            "votes": 45
          }
        ]
      }
    }
  }
}
```

**Error Response - Voting Still Open (400):**
```json
{
  "success": false,
  "error": "Cannot declare results while voting is still open in some constituencies"
}
```

**Error Response - No Token (401):**
```json
{
  "success": false,
  "error": "No token provided"
}
```

---

### 7. Get All Parties

**Endpoint:** `GET /api/ec/get-all-party?page=1&pageSize=10`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 10)

**cURL:**
```bash
curl -X GET "http://localhost:3000/api/ec/get-all-party?page=1&pageSize=10" \
  -H "Content-Type: application/json"
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Democratic Party",
      "logo_url": "https://example.com/logo1.png",
      "policy": "Strong economy, education focus",
      "created_at": "2026-03-20T00:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Progressive Alliance",
      "logo_url": "https://example.com/logo2.png",
      "policy": "Social welfare, healthcare",
      "created_at": "2026-03-20T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

---

### 8. Get All Candidates

**Endpoint:** `GET /api/ec/get-all-candidates?page=1&pageSize=10`

**cURL:**
```bash
curl -X GET "http://localhost:3000/api/ec/get-all-candidates?page=1&pageSize=10" \
  -H "Content-Type: application/json"
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Mr.",
      "firstName": "John",
      "lastName": "Smith",
      "number": 1,
      "imageUrl": "candidates/1_photo.jpg",
      "partyId": 1,
      "constituencyId": 1,
      "createdAt": "2026-03-20T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 24,
    "totalPages": 3
  }
}
```

---

## Public APIs

### 1. Get Election Status (Complete Snapshot)

**Endpoint:** `GET /api/public/election-status`

**No Authentication Required** ✅

**cURL:**
```bash
curl -X GET http://localhost:3000/api/public/election-status
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "isVotingClosed": false,
    "openConstituencies": 6,
    "closedConstituencies": 0,
    "totalConstituencies": 6,
    "totalCandidates": 24,
    "totalParties": 5,
    "constituencies": [
      {
        "id": 1,
        "province": "Bangkok",
        "district_number": 1,
        "is_closed": false,
        "created_at": "2026-03-20T15:31:04.345Z"
      }
    ],
    "parties": [
      {
        "id": 1,
        "name": "Democratic Party",
        "logo_url": "https://via.placeholder.com/150?text=Democratic",
        "policy": "Focus on education and healthcare reforms",
        "created_at": "2025-06-01T16:00:00.000Z"
      }
    ],
    "candidates": [
      {
        "id": 1,
        "title": "Mr.",
        "firstName": "Somchai",
        "lastName": "Jiravantana",
        "number": 1,
        "imageUrl": "https://via.placeholder.com/200?text=Somchai",
        "partyId": 1,
        "partyName": "Democratic Party",
        "partyLogo": "https://via.placeholder.com/150?text=Democratic",
        "constituencyId": 1,
        "constituency": {
          "id": 1,
          "province": "Bangkok",
          "districtNumber": 1,
          "isClosed": false
        },
        "createdAt": "2025-09-01T16:00:00.000Z"
      }
    ]
  }
}
```

**Field Descriptions:**
- `isVotingClosed`: Boolean - true if ALL constituencies have voting closed
- `openConstituencies`: Number - count of constituencies still open for voting
- `closedConstituencies`: Number - count of constituencies with voting closed
- `totalConstituencies`: Number - total number of constituencies
- `totalCandidates`: Number - total number of candidates
- `totalParties`: Number - total number of parties
- `constituencies`: Array - all constituency objects
- `parties`: Array - all political party objects
- `candidates`: Array - all candidate objects with party and constituency info

**Use Cases:**
1. Dashboard initialization - load all data in one call
2. Landing page display - show complete election info
3. Mobile app - efficient data loading
4. Admin overview - complete snapshot
5. Public website - election information portal

**Why This Endpoint:**
- Single API call replaces 4+ separate calls
- Atomic data - all consistent and up-to-date
- No authentication required - public access
- Perfectly formatted for frontend use
- Includes nested relationships

---

### 2. Get All Constituencies

**Endpoint:** `GET /api/public/constituencies`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/public/constituencies
```

**Success Response (200 OK):**
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "province": "Bangkok",
      "district_number": 1,
      "is_closed": false
    },
    {
      "id": 2,
      "province": "Bangkok",
      "district_number": 2,
      "is_closed": false
    }
  ]
}
```

---

### 3. Get All Parties

**Endpoint:** `GET /api/public/parties`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/public/parties
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Democratic Party",
      "logo_url": "https://example.com/logo1.png",
      "policy": "Strong economy focus"
    }
  ]
}
```

---

### 4. Get Party Details

**Endpoint:** `GET /api/public/parties/:id`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/public/parties/1
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Democratic Party",
    "logo_url": "https://example.com/logo1.png",
    "policy": "Strong economy focus"
  }
}
```

---

### 5. Get Party Overview (Results)

**Endpoint:** `GET /api/public/party-overview`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/public/party-overview
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalSeats": 3,
    "closedConstituencies": 3,
    "parties": [
      {
        "id": 1,
        "name": "Democratic Party",
        "logoUrl": "https://example.com/logo1.png",
        "seats": 2
      },
      {
        "id": 2,
        "name": "Progressive Alliance",
        "logoUrl": "https://example.com/logo2.png",
        "seats": 1
      }
    ]
  }
}
```

---

### 6. Get Candidate by ID

**Endpoint:** `GET /api/public/candidates/:id`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/public/candidates/1
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Mr.",
    "firstName": "John",
    "lastName": "Smith",
    "number": 1,
    "imageUrl": "candidates/1_photo.jpg",
    "partyId": 1,
    "partyName": "Democratic Party",
    "constituencyId": 1
  }
}
```

---

### Voter Account
```
National ID: 1234567890001
Password:    voter123
Role:        VOTER
```

### Admin Account
```
Username: admin_main
Password: password123
Role:     ADMIN
```

### EC Staff Account
```
National ID: 9999999999901
Password:    voter123
Role:        EC
```

---

## Error Responses

### Common Error Codes

| Status | Code | Message | Cause |
|--------|------|---------|-------|
| 400 | Bad Request | Invalid input | Missing/invalid fields |
| 401 | Unauthorized | No token provided | Missing authorization header |
| 401 | Unauthorized | Invalid or expired token | Token invalid/expired |
| 403 | Forbidden | Insufficient permissions | User lacks required role |
| 404 | Not Found | Route not found | Invalid endpoint |
| 500 | Server Error | Internal error | Server issue |

### Generic Error Response Format
```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## Security Notes

### ⚠️ Critical Issues

**Missing Authentication:**
- ❌ `POST /api/ec/update-voting` - Anyone can close/open voting
- ❌ `POST /api/ec/upload` - Anyone can upload files
- ❌ `POST /api/ec/AddCandidates` - Anyone can add candidates

**Should require:** EC Staff or Admin role (with Bearer token)

### ✅ Implemented

- ✅ `POST /api/ec/declare-results` - Requires authentication
- ✅ `POST /api/voter/vote` - Requires authentication
- ✅ `GET /api/auth/me` - Requires authentication
- ✅ Token validation with JWT
- ✅ Password hashing with bcrypt

### Token Format
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payload.signature
```

### Token Expiration
- Default: 7 days
- Configured in: `.env` (JWT_EXPIRES_IN)

---

## Response Format Standards

All responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": {},
  "message": "Optional message"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## Database Info

### Current Seed Data
- **Constituencies:** 6 (Bangkok, Chiang Mai, Phuket)
- **Political Parties:** 5
- **Candidates:** 24
- **Voters:** 12
- **EC Staff:** 2
- **Admins:** 2
- **Votes:** 4

To reseed: `npm run seed`

---

## Useful Commands

```bash
# Start server
npm run dev

# Build production
npm run build

# Run tests
npm test

# Reseed database
npm run seed

# Check database connection
npm run db:check
```

---

**For questions or issues, check the logs in the console or database.**
