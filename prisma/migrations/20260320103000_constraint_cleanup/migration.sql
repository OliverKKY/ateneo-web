PRAGMA foreign_keys=OFF;

CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthDate" DATETIME,
    "voice" TEXT CHECK ("voice" IN ('S', 'A', 'T', 'B') OR "voice" IS NULL),
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "gdprConsent" BOOLEAN NOT NULL DEFAULT false,
    "roleId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_User" (
    "id",
    "firstName",
    "lastName",
    "birthDate",
    "voice",
    "phone",
    "email",
    "passwordHash",
    "isActive",
    "gdprConsent",
    "roleId",
    "createdAt",
    "updatedAt"
)
SELECT
    "id",
    "firstName",
    "lastName",
    "birthDate",
    CASE
        WHEN "voice" IN ('S', 'A', 'T', 'B') THEN "voice"
        ELSE NULL
    END,
    "phone",
    "email",
    "passwordHash",
    "isActive",
    "gdprConsent",
    "roleId",
    "createdAt",
    "updatedAt"
FROM "User";

DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "startDateTime" DATETIME NOT NULL,
    "endDateTime" DATETIME,
    "signupOpenDate" DATETIME,
    "signupCloseDate" DATETIME,
    "type" TEXT NOT NULL CHECK ("type" IN ('CONCERT', 'RETREAT'))
);

INSERT INTO "new_Event" (
    "id",
    "name",
    "location",
    "startDateTime",
    "endDateTime",
    "signupOpenDate",
    "signupCloseDate",
    "type"
)
SELECT
    "id",
    "name",
    "location",
    "startDateTime",
    "endDateTime",
    "signupOpenDate",
    "signupCloseDate",
    CASE
        WHEN "type" = 'Koncert' THEN 'CONCERT'
        WHEN "type" = 'Soustředění' THEN 'RETREAT'
        WHEN "type" IN ('CONCERT', 'RETREAT') THEN "type"
        ELSE 'CONCERT'
    END
FROM "Event";

DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";

CREATE TABLE "new_EventSignup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "status" TEXT NOT NULL CHECK ("status" IN ('going', 'maybe', 'not_going')),
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EventSignup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EventSignup_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_EventSignup" (
    "id",
    "userId",
    "eventId",
    "status",
    "createdAt"
)
SELECT
    "id",
    "userId",
    "eventId",
    CASE
        WHEN "status" IN ('going', 'maybe', 'not_going') THEN "status"
        ELSE 'maybe'
    END,
    "createdAt"
FROM "EventSignup";

DROP TABLE "EventSignup";
ALTER TABLE "new_EventSignup" RENAME TO "EventSignup";
CREATE UNIQUE INDEX "EventSignup_userId_eventId_key" ON "EventSignup"("userId", "eventId");

CREATE TABLE "new_Song" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "duration" TEXT,
    "copyCount" INTEGER NOT NULL DEFAULT 0,
    "sheetType" TEXT CHECK ("sheetType" IN ('SATB', 'SSA', 'SSAA', 'TTBB', 'SAB', 'UNISON', 'INSTRUMENTAL', 'OTHER') OR "sheetType" IS NULL),
    "fileLinks" TEXT
);

INSERT INTO "new_Song" (
    "id",
    "title",
    "author",
    "isActive",
    "description",
    "duration",
    "copyCount",
    "sheetType",
    "fileLinks"
)
SELECT
    "id",
    "title",
    "author",
    "isActive",
    "description",
    "duration",
    "copyCount",
    CASE
        WHEN "sheetType" IS NULL OR TRIM("sheetType") = '' THEN NULL
        WHEN "sheetType" IN ('SATB', 'SSA', 'SSAA', 'TTBB', 'SAB', 'UNISON', 'INSTRUMENTAL', 'OTHER') THEN "sheetType"
        ELSE 'OTHER'
    END,
    "fileLinks"
FROM "Song";

DROP TABLE "Song";
ALTER TABLE "new_Song" RENAME TO "Song";

DROP TABLE IF EXISTS "Rehearsal";

PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
