/*
  Warnings:

  - Added the required column `name` to the `ProjectDependency` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `ProjectDependency` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `ProjectDependency` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Check" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "projectDependencyId" INTEGER,
    "run" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "pass" BOOLEAN NOT NULL,
    "datetime" DATETIME NOT NULL,
    "projectId" INTEGER,
    CONSTRAINT "Check_projectDependencyId_fkey" FOREIGN KEY ("projectDependencyId") REFERENCES "ProjectDependency" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Check" ("createdAt", "datetime", "id", "pass", "projectId", "run", "updatedAt", "url") SELECT "createdAt", "datetime", "id", "pass", "projectId", "run", "updatedAt", "url" FROM "Check";
DROP TABLE "Check";
ALTER TABLE "new_Check" RENAME TO "Check";
CREATE TABLE "new_ProjectDependency" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,
    CONSTRAINT "ProjectDependency_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProjectDependency" ("createdAt", "id", "updatedAt") SELECT "createdAt", "id", "updatedAt" FROM "ProjectDependency";
DROP TABLE "ProjectDependency";
ALTER TABLE "new_ProjectDependency" RENAME TO "ProjectDependency";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
