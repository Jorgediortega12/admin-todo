-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAcitve" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "role" TEXT[] DEFAULT ARRAY['user']::TEXT[];
