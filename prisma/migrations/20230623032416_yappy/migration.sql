-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isTrashed" BOOLEAN NOT NULL DEFAULT false;
