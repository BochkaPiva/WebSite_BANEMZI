-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventType" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "guestsBucket" TEXT NOT NULL,
    "contactKind" TEXT NOT NULL,
    "contactValue" TEXT NOT NULL,
    "callbackType" TEXT NOT NULL,
    "callbackAtUtc" DATETIME,
    "utm" TEXT,
    "userAgent" TEXT,
    "ipHash" TEXT
);
