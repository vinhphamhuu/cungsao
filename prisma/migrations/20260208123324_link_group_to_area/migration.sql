-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "areaId" TEXT;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;
