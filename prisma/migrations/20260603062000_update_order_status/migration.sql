ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";

CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED');

ALTER TABLE "Order"
  ALTER COLUMN "status" DROP DEFAULT,
  ALTER COLUMN "status" TYPE "OrderStatus"
  USING (
    CASE "status"::text
      WHEN 'SHIPPED' THEN 'PROCESSING'
      WHEN 'DELIVERED' THEN 'COMPLETED'
      ELSE 'PENDING'
    END
  )::"OrderStatus",
  ALTER COLUMN "status" SET DEFAULT 'PENDING';

DROP TYPE "OrderStatus_old";
