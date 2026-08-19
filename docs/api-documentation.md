# API Documentation

This document provides comprehensive documentation for all available APIs in the Tollugatti108 platform.

## Table of Contents

- [Authentication](#authentication)
- [User Profile](#user-profile)
- [Events](#events)
- [Tournaments](#tournaments)
- [Teams](#teams)
- [Games](#games)
- [Leaderboard](#leaderboard)
- [Forums](#forums)
- [Content](#content)
- [Email](#email)
- [Alerts](#alerts)
- [Analysis](#analysis)
- [ELO Rating](#elo-rating)
- [Host Management](#host-management)

---

## Authentication

### Sign In

**POST** `/api/auth/sign-in`

Authenticate a user with email/handle and password.

**Request Body:**

```json
{
  "email": "user@example.com", // Optional if handle provided
  "handle": "username", // Optional if email provided
  "password": "password123",
  "captchaToken": "turnstile-token" // Required
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

**Authentication:** None required
**Notes:** Requires valid Turnstile captcha token. Can authenticate with either email or handle.

---

### Register

**POST** `/api/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Full Name",
  "handle": "username",
  "captchaToken": "turnstile-token"
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

**Authentication:** None required

---

### Forgot Password

**POST** `/api/auth/forgot-password`

Request a password reset email.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

**Authentication:** None required

---

### Reset Password

**POST** `/api/auth/reset-password`

Reset password using a reset token.

**Request Body:**

```json
{
  "token": "reset-token",
  "password": "newpassword123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password reset successful"
}
```

**Authentication:** None required

---

### Verify Email

**POST** `/api/auth/verify-email`

Verify user email address.

**Request Body:**

```json
{
  "token": "verification-token"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Email verified"
}
```

**Authentication:** None required

---

### Get Session

**GET** `/api/auth/session`

Get current user session information.

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Full Name"
  }
}
```

**Authentication:** Required (session cookie)

---

### Verify Turnstile

**POST** `/api/auth/verify-turnstile`

Verify Cloudflare Turnstile captcha token.

**Request Body:**

```json
{
  "token": "turnstile-token"
}
```

**Response:**

```json
{
  "success": true
}
```

**Authentication:** None required

---

## User Profile

### Get Profile

**GET** `/api/user/profile`

Get current user's profile information.

**Response:**

```json
{
  "profile": {
    "name": "Full Name",
    "email": "user@example.com",
    "handle": "username",
    "display_name": "Display Name",
    "bio": "User bio",
    "avatar_url": "https://...",
    "account_name": "Account Name"
  }
}
```

**Authentication:** Required

---

### Update Profile

**PUT** `/api/user/profile`

Update user profile information.

**Request:** Multipart form data

- `name` (string, required): Full name
- `email` (string, required): Email address
- `handle` (string, required): Username handle
- `displayName` (string): Display name
- `bio` (string): User bio
- `avatar` (file): Avatar image file

**Response:**

```json
{
  "success": true,
  "profile": {
    "name": "Full Name",
    "email": "user@example.com",
    "handle": "username",
    "display_name": "Display Name",
    "bio": "User bio",
    "avatar_url": "https://..."
  }
}
```

**Authentication:** Required
**Notes:** Handle must be unique and contain only letters, numbers, and hyphens.

---

### Get User Details

**GET** `/api/user/details`

Get detailed user information including stats and achievements.

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "name": "Full Name",
    "handle": "username",
    "stats": {},
    "achievements": []
  }
}
```

**Authentication:** Required

---

## Events

### List Events

**GET** `/api/events`

Get a list of events with optional filters.

**Query Parameters:**

- `status` (string): Filter by status (draft, published, ongoing, completed, cancelled)
- `event_type` (string): Filter by type (tournament, casual, practice)
- `venue_mode` (string): Filter by venue (online, offline, hybrid)
- `game_id` (string): Filter by game ID
- `host_id` (string): Filter by host ID
- `mine` (boolean): Get only user's own events
- `public` (boolean): Get only public events

**Response:**

```json
{
  "events": [
    {
      "id": "uuid",
      "title": "Event Title",
      "description": "Event description",
      "event_type": "tournament",
      "venue_mode": "online",
      "start_time": "2024-01-01T00:00:00Z",
      "end_time": "2024-01-01T04:00:00Z",
      "status": "published",
      "tournaments": {
        "id": "uuid",
        "name": "Tournament Name",
        "format": "single_elimination",
        "max_participants": 16
      }
    }
  ]
}
```

**Authentication:** Optional (required for `mine=true`)

---

### Create Event

**POST** `/api/events`

Create a new event.

**Request Body:**

```json
{
  "title": "Event Title",
  "description": "Event description",
  "event_type": "tournament",
  "venue_mode": "online",
  "venue_name": "Venue Name",
  "venue_address": "Address",
  "venue_city": "City",
  "venue_coordinates": { "lat": 0, "lng": 0 },
  "start_time": "2024-01-01T00:00:00Z",
  "end_time": "2024-01-01T04:00:00Z",
  "registration_start_time": "2024-01-01T00:00:00Z",
  "registration_end_time": "2024-01-01T00:00:00Z",
  "max_participants": 16,
  "price": 0,
  "is_public": false,
  "visibility": "private",
  "game_id": "game-uuid",
  "tournament_format": "single_elimination",
  "has_group_stage": false,
  "groups_count": 0
}
```

**Response:**

```json
{
  "event": {
    "id": "uuid",
    "title": "Event Title",
    "status": "draft"
  },
  "tournament": {
    "id": "uuid",
    "name": "Tournament Name"
  },
  "message": "Event and tournament created successfully"
}
```

**Authentication:** Required

---

### Get Event Details

**GET** `/api/events/[id]`

Get detailed information about a specific event.

**Response:**

```json
{
  "event": {
    "id": "uuid",
    "title": "Event Title",
    "description": "Event description",
    "start_time": "2024-01-01T00:00:00Z",
    "participants": [],
    "matches": []
  }
}
```

**Authentication:** Optional

---

### Update Event

**PUT** `/api/events/[id]`

Update an existing event.

**Request Body:** Same as Create Event

**Response:**

```json
{
  "event": {
    "id": "uuid",
    "title": "Updated Title"
  },
  "message": "Event updated successfully"
}
```

**Authentication:** Required (must be event creator or host)

---

### Delete Event

**DELETE** `/api/events/[id]`

Delete an event.

**Response:**

```json
{
  "message": "Event deleted successfully"
}
```

**Authentication:** Required (must be event creator or host)

---

### Check In to Event

**POST** `/api/events/[id]/checkin`

Check in to an event.

**Request Body:**

```json
{
  "team_id": "uuid" // Optional, for team events
}
```

**Response:**

```json
{
  "checkin": {
    "id": "uuid",
    "event_id": "uuid",
    "user_id": "uuid",
    "checked_in_at": "2024-01-01T00:00:00Z"
  }
}
```

**Authentication:** Required

---

### Get Event Leaderboard

**GET** `/api/events/[id]/leaderboard`

Get leaderboard for an event.

**Response:**

```json
{
  "leaderboard": [
    {
      "rank": 1,
      "user_id": "uuid",
      "name": "Player Name",
      "score": 100,
      "wins": 5,
      "losses": 0
    }
  ]
}
```

**Authentication:** Optional

---

### Create Event Invitation

**POST** `/api/events/[id]/invite`

Create invitation links for an event.

**Request Body:**

```json
{
  "max_uses": 10,
  "expires_at": "2024-01-01T00:00:00Z"
}
```

**Response:**

```json
{
  "invitation": {
    "token": "invite-token",
    "url": "https://app.com/events/uuid/join?token=invite-token"
  }
}
```

**Authentication:** Required (must be event creator or host)

---

### Get Invitation QR Code

**GET** `/api/events/[id]/invitations/[token]/qr`

Get QR code for event invitation.

**Response:** PNG image

**Authentication:** None required

---

### List Event Matches

**GET** `/api/events/[id]/matches`

Get all matches for an event.

**Response:**

```json
{
  "matches": [
    {
      "id": "uuid",
      "event_id": "uuid",
      "player1_id": "uuid",
      "player2_id": "uuid",
      "status": "pending",
      "scheduled_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Authentication:** Optional

---

### Create Event Match

**POST** `/api/events/[id]/matches`

Create a new match for an event.

**Request Body:**

```json
{
  "player1_id": "uuid",
  "player2_id": "uuid",
  "scheduled_at": "2024-01-01T00:00:00Z"
}
```

**Response:**

```json
{
  "match": {
    "id": "uuid",
    "status": "pending"
  }
}
```

**Authentication:** Required (must be event creator or host)

---

### Submit Match Result

**POST** `/api/events/[id]/matches/[matchId]/result`

Submit result for a match.

**Request Body:**

```json
{
  "winner_id": "uuid",
  "score": {
    "player1": 10,
    "player2": 5
  }
}
```

**Response:**

```json
{
  "match": {
    "id": "uuid",
    "status": "completed",
    "winner_id": "uuid"
  }
}
```

**Authentication:** Required (must be participant or event organizer)

---

## Tournaments

### List Tournaments

**GET** `/api/tournaments`

Get a list of tournaments with optional filters.

**Query Parameters:**

- `status` (string): Filter by status
- `game_id` (string): Filter by game ID
- `host_id` (string): Filter by host ID
- `mine` (boolean): Get only user's own tournaments

**Response:**

```json
{
  "tournaments": [
    {
      "id": "uuid",
      "name": "Tournament Name",
      "format": "single_elimination",
      "max_participants": 16,
      "start_time": "2024-01-01T00:00:00Z",
      "status": "draft",
      "games": {
        "name": "Game Name",
        "handle": "game-handle"
      },
      "host_profiles": {
        "organization_name": "Host Organization"
      }
    }
  ]
}
```

**Authentication:** Optional

---

### Create Tournament

**POST** `/api/tournaments`

Create a new tournament.

**Request Body:**

```json
{
  "name": "Tournament Name",
  "game_id": "uuid",
  "format": "single_elimination",
  "max_participants": 16,
  "start_time": "2024-01-01T00:00:00Z",
  "prize_pool": 1000,
  "rules": "Tournament rules",
  "description": "Tournament description",
  "event_id": "uuid" // Optional
}
```

**Response:**

```json
{
  "tournament": {
    "id": "uuid",
    "name": "Tournament Name",
    "status": "draft"
  },
  "message": "Tournament created successfully"
}
```

**Authentication:** Required (must be a registered host)

---

### Get Tournament Details

**GET** `/api/tournaments/[id]`

Get detailed information about a tournament.

**Response:**

```json
{
  "tournament": {
    "id": "uuid",
    "name": "Tournament Name",
    "participants": [],
    "brackets": [],
    "matches": []
  }
}
```

**Authentication:** Optional

---

### Join Tournament

**POST** `/api/tournaments/[id]/join`

Join a tournament.

**Request Body:**

```json
{
  "team_id": "uuid" // Optional, for team tournaments
}
```

**Response:**

```json
{
  "participant": {
    "id": "uuid",
    "tournament_id": "uuid",
    "user_id": "uuid"
  }
}
```

**Authentication:** Required

---

### Start Tournament

**POST** `/api/tournaments/[id]/start`

Start a tournament and generate brackets.

**Response:**

```json
{
  "tournament": {
    "id": "uuid",
    "status": "ongoing"
  },
  "brackets": []
}
```

**Authentication:** Required (must be tournament creator or host)

---

## Teams

### List Teams

**GET** `/api/teams`

Get a list of teams.

**Query Parameters:**

- `mine` (boolean): Get only teams where user is captain or member

**Response:**

```json
{
  "teams": [
    {
      "id": "uuid",
      "name": "Team Name",
      "tag": "TAG",
      "description": "Team description",
      "logo_url": "https://...",
      "captain": {
        "name": "Captain Name",
        "handle": "captain-handle"
      }
    }
  ]
}
```

**Authentication:** Optional

---

### Create Team

**POST** `/api/teams`

Create a new team.

**Request Body:**

```json
{
  "name": "Team Name",
  "tag": "TAG",
  "description": "Team description",
  "logo_url": "https://..."
}
```

**Response:**

```json
{
  "team": {
    "id": "uuid",
    "name": "Team Name",
    "captain_id": "uuid"
  },
  "message": "Team created"
}
```

**Authentication:** Required
**Notes:** Users can create up to 2 teams by default.

---

### Get Team Details

**GET** `/api/teams/[id]`

Get detailed information about a team.

**Response:**

```json
{
  "team": {
    "id": "uuid",
    "name": "Team Name",
    "tag": "TAG",
    "description": "Team description",
    "captain": {
      "name": "Captain Name",
      "handle": "captain-handle",
      "avatar_url": "https://..."
    },
    "members": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "role": "member",
        "status": "active",
        "joined_at": "2024-01-01T00:00:00Z",
        "user": {
          "name": "Member Name",
          "handle": "member-handle",
          "avatar_url": "https://..."
        }
      }
    ],
    "member_count": 5
  }
}
```

**Authentication:** Optional

---

### Delete Team

**DELETE** `/api/teams/[id]`

Delete a team.

**Response:**

```json
{
  "message": "Team deleted"
}
```

**Authentication:** Required (must be team captain)

---

### Get Team Messages

**GET** `/api/teams/[id]/messages`

Get messages for a team.

**Query Parameters:**

- `limit` (number): Number of messages to return (default: 50)
- `before` (string): Get messages before this timestamp (for pagination)

**Response:**

```json
{
  "messages": [
    {
      "id": "uuid",
      "content": "Message content",
      "created_at": "2024-01-01T00:00:00Z",
      "user_id": "uuid",
      "user": {
        "name": "User Name",
        "handle": "user-handle",
        "avatar_url": "https://..."
      }
    }
  ]
}
```

**Authentication:** Required (must be team member)

---

### Send Team Message

**POST** `/api/teams/[id]/messages`

Send a message to a team.

**Request Body:**

```json
{
  "content": "Message content"
}
```

**Response:**

```json
{
  "message": {
    "id": "uuid",
    "content": "Message content",
    "created_at": "2024-01-01T00:00:00Z",
    "user": {
      "name": "User Name",
      "handle": "user-handle"
    }
  }
}
```

**Authentication:** Required (must be team member)

---

### Add Team Member

**POST** `/api/teams/[id]/members`

Add a member to a team.

**Request Body:**

```json
{
  "user_id": "uuid",
  "role": "member"
}
```

**Response:**

```json
{
  "member": {
    "id": "uuid",
    "team_id": "uuid",
    "user_id": "uuid",
    "role": "member"
  }
}
```

**Authentication:** Required (must be team captain)

---

### Remove Team Member

**DELETE** `/api/teams/[id]/members/[memberId]`

Remove a member from a team.

**Response:**

```json
{
  "message": "Member removed"
}
```

**Authentication:** Required (must be team captain)

---

### Update Team Member Role

**PUT** `/api/teams/[id]/members/[memberId]`

Update a team member's role.

**Request Body:**

```json
{
  "role": "co-captain"
}
```

**Response:**

```json
{
  "member": {
    "id": "uuid",
    "role": "co-captain"
  }
}
```

**Authentication:** Required (must be team captain)

---

## Games

### List Games

**GET** `/api/games`

Get a list of all available games.

**Response:**

```json
{
  "games": [
    {
      "id": "uuid",
      "name": "Game Name",
      "handle": "game-handle",
      "description": "Game description",
      "min_players": 2,
      "max_players": 4,
      "category": "strategy"
    }
  ]
}
```

**Authentication:** None required

---

### Get Game Details

**GET** `/api/games/[handle]`

Get detailed information about a specific game.

**Response:**

```json
{
  "game": {
    "id": "uuid",
    "name": "Game Name",
    "handle": "game-handle",
    "description": "Game description",
    "rules": "Game rules",
    "min_players": 2,
    "max_players": 4
  }
}
```

**Authentication:** None required

---

### Aaduhuli (Tiger and Goat)

The Aaduhuli game API uses a single endpoint for various actions (create, join, move, leave) and a GET endpoint to list matches.

#### List Matches (Find Bot Matches)

**GET** `/api/games/aaduhuli3`

List all active matches.

**To find available Bot matches:**
Filter the response for matches where:

1. `players[1]` (Tiger) is occupied by the Bot (has a name).
2. `players[0]` (Goat) is empty (name is empty/null).

**Response:**

```json
[
  {
    "matchID": "uuid",
    "players": [
      { "id": 0, "name": "" }, // Empty slot (Goat)
      { "id": 1, "name": "AaduhuliBot" } // Occupied by Bot (Tiger)
    ],
    "gameName": "aaduhuli3",
    "numPlayers": 2,
    "setupData": {}
  }
]
```

**Authentication:** Optional

---

#### Perform Game Action

**POST** `/api/games/aaduhuli3`

Handle game actions including creating, joining, leaving, and making moves.

**Common Response (Error):**

```json
{
  "error": "Error message"
}
```

---

##### 1. Create Match

Create a new multiplayer match (for PvP).

**Request Body:**

```json
{
  "action": "create",
  "numPlayers": 2,
  "playerData": {
    "players": [
      { "name": "Host Name" } // Optional
    ]
  }
}
```

**Response:**

```json
{
  "matchID": "uuid"
}
```

---

##### 2. Join Match (Bot or PvP)

Join an existing match. To play against a bot, use the `matchID` from the "List Matches" step and join as Player 0.

**Request Body:**

```json
{
  "action": "join",
  "matchID": "match-uuid",
  "playerID": "0", // Use "0" to join as Goat against Bot (Player 1)
  "playerName": "Your Name"
}
```

**Response:**

```json
{
  "playerCredentials": "secret-credentials"
}
```

---

##### 3. Make Move

Submit a move.

**Request Body:**

```json
{
  "action": "move",
  "matchID": "match-uuid",
  "playerID": "0",
  "credentials": "secret-credentials",
  "type": "placeGoat", // Move types: "placeGoat", "moveGoat", "moveTiger"
  "position": "c3", // Required for "placeGoat"
  "from": "c3", // Required for "moveGoat"/"moveTiger"
  "to": "c4" // Required for "moveGoat"/"moveTiger"
}
```

**Response:**

```json
{
  // Updated game state object
}
```

---

##### 4. Leave Match

Leave the current match.

**Request Body:**

```json
{
  "action": "leave",
  "matchID": "match-uuid",
  "playerID": "0",
  "credentials": "secret-credentials"
}
```

**Response:**

```json
{
  "success": true
}
```

**Authentication:** Optional (Credentials required for move/leave)

---

### Chowkabara

#### Create Match

**POST** `/api/games/chowkabara5`

Create a new Chowkabara match.

**Request Body:**

```json
{
  "opponent_id": "uuid"
}
```

**Response:**

```json
{
  "match": {
    "id": "uuid",
    "game_id": "chowkabara5"
  }
}
```

**Authentication:** Required

---

#### Get Active Match

**GET** `/api/games/chowkabara5/active`

Get user's active Chowkabara match.

**Response:**

```json
{
  "match": {
    "id": "uuid",
    "game_state": {},
    "current_turn": "player1"
  }
}
```

**Authentication:** Required

---

### Dahi Handi Game

#### Create Session

**POST** `/api/games/dahi-handi/session`

Create a new Dahi Handi game session.

**Response:**

```json
{
  "session": {
    "id": "uuid",
    "score": 0,
    "shots_remaining": 10
  }
}
```

**Authentication:** Required

---

#### Submit Shot

**POST** `/api/games/dahi-handi/shot`

Submit a shot in Dahi Handi game.

**Request Body:**

```json
{
  "session_id": "uuid",
  "power": 75,
  "angle": 45
}
```

**Response:**

```json
{
  "result": {
    "hit": true,
    "points": 10,
    "total_score": 10
  }
}
```

**Authentication:** Required

---

#### Get Leaderboard

**GET** `/api/games/dahi-handi/leaderboard`

Get Dahi Handi leaderboard.

**Query Parameters:**

- `limit` (number): Number of results (default: 10)

**Response:**

```json
{
  "leaderboard": [
    {
      "rank": 1,
      "user_id": "uuid",
      "name": "Player Name",
      "high_score": 100
    }
  ]
}
```

**Authentication:** None required

---

### Hangman

#### Start New Game

**POST** `/api/games/hangman/new`

Start a new Hangman game.

**Request Body:**

```json
{
  "topic": "animals"
}
```

**Response:**

```json
{
  "game": {
    "id": "uuid",
    "word_length": 8,
    "guesses_remaining": 6,
    "guessed_letters": []
  }
}
```

**Authentication:** Optional

---

#### Make Guess

**POST** `/api/games/hangman/guess`

Make a letter guess in Hangman.

**Request Body:**

```json
{
  "game_id": "uuid",
  "letter": "a"
}
```

**Response:**

```json
{
  "result": {
    "correct": true,
    "word_state": "a____",
    "guesses_remaining": 6,
    "game_over": false,
    "won": false
  }
}
```

**Authentication:** Optional

---

#### Get Game State

**GET** `/api/games/hangman/state?game_id=uuid`

Get current Hangman game state.

**Response:**

```json
{
  "game": {
    "id": "uuid",
    "word_state": "a____",
    "guesses_remaining": 5,
    "guessed_letters": ["a", "e"]
  }
}
```

**Authentication:** Optional

---

#### Get Topics

**GET** `/api/games/hangman/topics`

Get available Hangman topics.

**Response:**

```json
{
  "topics": ["animals", "countries", "movies", "food"]
}
```

**Authentication:** None required

---

#### Get Scores

**GET** `/api/games/hangman/scores`

Get Hangman high scores.

**Response:**

```json
{
  "scores": [
    {
      "rank": 1,
      "player": "Player Name",
      "score": 100
    }
  ]
}
```

**Authentication:** None required

---

### Tic-Tac-Toe

#### Create Match

**POST** `/api/games/tictactoe`

Create a new Tic-Tac-Toe match.

**Request Body:**

```json
{
  "opponent_id": "uuid", // Optional
  "difficulty": "medium" // For bot: easy, medium, hard
}
```

**Response:**

```json
{
  "match": {
    "id": "uuid",
    "board": [null, null, null, null, null, null, null, null, null],
    "current_player": "X"
  }
}
```

**Authentication:** Required

---

## Leaderboard

### Get Overall Leaderboard

**GET** `/api/leaderboard`

Get the overall platform leaderboard.

**Query Parameters:**

- `limit` (number): Number of results (default: 10)
- `page` (number): Page number (default: 0)

**Response:**

```json
{
  "leaderboard": [
    {
      "rank": 1,
      "user_id": "uuid",
      "username": "player1",
      "display_name": "Player One",
      "avatar_url": "https://...",
      "total_score": 1000,
      "games_played": 50,
      "wins": 35
    }
  ],
  "pagination": {
    "total": 100,
    "page": 0,
    "limit": 10,
    "pages": 10
  }
}
```

**Authentication:** None required

---

## Forums

### List Forums

**GET** `/api/forums`

Get a list of all forums.

**Response:**

```json
{
  "forums": [
    {
      "id": "uuid",
      "name": "Forum Name",
      "description": "Forum description",
      "thread_count": 10,
      "post_count": 100
    }
  ]
}
```

**Authentication:** None required

---

### Get Forum Threads

**GET** `/api/forums/[id]/threads`

Get threads in a forum.

**Query Parameters:**

- `limit` (number): Number of threads (default: 20)
- `page` (number): Page number (default: 0)

**Response:**

```json
{
  "threads": [
    {
      "id": "uuid",
      "title": "Thread Title",
      "author": "Author Name",
      "created_at": "2024-01-01T00:00:00Z",
      "reply_count": 5
    }
  ]
}
```

**Authentication:** None required

---

### Create Thread

**POST** `/api/forums/[id]/threads`

Create a new thread in a forum.

**Request Body:**

```json
{
  "title": "Thread Title",
  "content": "Thread content"
}
```

**Response:**

```json
{
  "thread": {
    "id": "uuid",
    "title": "Thread Title"
  }
}
```

**Authentication:** Required

---

## Content

### Get Guides

**GET** `/api/content/guides`

Get learning guides and tutorials.

**Query Parameters:**

- `game_id` (string): Filter by game
- `type` (string): Filter by type (tutorial, rulebook, strategy)

**Response:**

```json
{
  "guides": [
    {
      "id": "uuid",
      "title": "Guide Title",
      "type": "tutorial",
      "game_id": "uuid",
      "content": "Guide content",
      "author": "Author Name"
    }
  ]
}
```

**Authentication:** None required

---

## Email

### Send Email

**POST** `/api/email/send`

Send an email (internal use).

**Request Body:**

```json
{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "html": "<p>Email content</p>"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Email sent"
}
```

**Authentication:** Required (admin only)

---

## Alerts

### Get Alerts

**GET** `/api/alerts`

Get user alerts and notifications.

**Response:**

```json
{
  "alerts": [
    {
      "id": "uuid",
      "type": "match_invite",
      "message": "You have been invited to a match",
      "read": false,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Authentication:** Required

---

### Mark Alert as Read

**PUT** `/api/alerts/[id]`

Mark an alert as read.

**Response:**

```json
{
  "success": true
}
```

**Authentication:** Required

---

## Analysis

### Get Next Move Suggestion

**POST** `/api/analysis/next-move`

Get AI-powered next move suggestion for a game.

**Request Body:**

```json
{
  "game_id": "uuid",
  "board_state": {},
  "player": "X"
}
```

**Response:**

```json
{
  "suggestion": {
    "move": { "row": 1, "col": 1 },
    "confidence": 0.85,
    "reasoning": "This move blocks opponent's winning path"
  }
}
```

**Authentication:** Required

---

### Get Win Probability

**POST** `/api/analysis/probability`

Get win probability analysis for current game state.

**Request Body:**

```json
{
  "game_id": "uuid",
  "board_state": {},
  "player": "X"
}
```

**Response:**

```json
{
  "probability": {
    "player1_win": 0.65,
    "player2_win": 0.3,
    "draw": 0.05
  }
}
```

**Authentication:** Required

---

## ELO Rating

### Get Player Rating

**GET** `/api/elo/rating?user_id=uuid&game_id=uuid`

Get ELO rating for a player in a specific game.

**Query Parameters:**

- `user_id` (string): User ID
- `game_id` (string): Game ID

**Response:**

```json
{
  "rating": {
    "user_id": "uuid",
    "game_id": "uuid",
    "elo": 1500,
    "games_played": 25,
    "wins": 15,
    "losses": 10
  }
}
```

**Authentication:** None required

---

## Host Management

### Register as Host

**POST** `/api/hosts/register`

Register as an event host.

**Request Body:**

```json
{
  "organization_name": "Organization Name",
  "description": "Host description",
  "website": "https://example.com",
  "contact_email": "contact@example.com"
}
```

**Response:**

```json
{
  "host_profile": {
    "id": "uuid",
    "organization_name": "Organization Name",
    "status": "pending"
  }
}
```

**Authentication:** Required

---

### Get Host Settings

**GET** `/api/host/settings`

Get host profile settings.

**Response:**

```json
{
  "settings": {
    "organization_name": "Organization Name",
    "description": "Host description",
    "website": "https://example.com",
    "verified": true
  }
}
```

**Authentication:** Required (must be a host)

---

### Update Host Settings

**PUT** `/api/host/settings`

Update host profile settings.

**Request Body:**

```json
{
  "organization_name": "Updated Name",
  "description": "Updated description",
  "website": "https://newsite.com"
}
```

**Response:**

```json
{
  "settings": {
    "organization_name": "Updated Name"
  }
}
```

**Authentication:** Required (must be a host)

---

## Featured Content

### Get Featured Items

**GET** `/api/featured`

Get featured content (games, tournaments, etc.).

**Response:**

```json
{
  "featured": {
    "games": [],
    "tournaments": [],
    "events": []
  }
}
```

**Authentication:** None required

---

### Get Featured Puzzles

**GET** `/api/featured/puzzles`

Get featured puzzles.

**Response:**

```json
{
  "puzzles": [
    {
      "id": "uuid",
      "title": "Puzzle Title",
      "difficulty": "medium",
      "category": "logic"
    }
  ]
}
```

**Authentication:** None required

---

### Get Featured Quiz Topics

**GET** `/api/featured/quiz-topics`

Get featured quiz topics.

**Response:**

```json
{
  "topics": [
    {
      "id": "uuid",
      "name": "Topic Name",
      "question_count": 20
    }
  ]
}
```

**Authentication:** None required

---

## Common Response Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request parameters
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

---

## Authentication

Most endpoints require authentication via session cookies. After successful login via `/api/auth/sign-in`, the session cookie is automatically set and included in subsequent requests.

For endpoints marked as "Authentication: Required", you must be logged in. For "Authentication: Optional", the response may vary based on authentication status.

---

## Rate Limiting

API rate limits apply to prevent abuse:

- **Authenticated users**: 100 requests per minute
- **Unauthenticated users**: 20 requests per minute

---

## Pagination

List endpoints support pagination via query parameters:

- `limit`: Number of items per page (default varies by endpoint)
- `page` or `offset`: Page number or offset for results

---

## Error Handling

All error responses follow this format:

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE" // Optional
}
```

---

_Last updated: 2026-02-13_
