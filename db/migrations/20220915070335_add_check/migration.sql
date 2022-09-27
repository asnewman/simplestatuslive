-- CreateTable
CREATE TABLE "Check" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "projectId" INTEGER,
    "run" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "pass" BOOLEAN NOT NULL,
    "datetime" DATETIME NOT NULL,
    CONSTRAINT "Check_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
