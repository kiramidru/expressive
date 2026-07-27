PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "_ProductCategoryMigration" AS
SELECT "id" AS "productId", "categoryId"
FROM "Product"
WHERE "categoryId" IS NOT NULL;

CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "brandId" INTEGER,
    "sellerId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Product_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_Product" (
    "id",
    "name",
    "description",
    "brandId",
    "sellerId",
    "amount",
    "price",
    "createdAt",
    "updatedAt"
)
SELECT
    "id",
    "name",
    "description",
    "brandId",
    "sellerId",
    "amount",
    "price",
    "createdAt",
    "updatedAt"
FROM "Product";

DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");

CREATE TABLE "_CategoryToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CategoryToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CategoryToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "_CategoryToProduct" ("A", "B")
SELECT "categoryId", "productId"
FROM "_ProductCategoryMigration";

DROP TABLE "_ProductCategoryMigration";

CREATE UNIQUE INDEX "_CategoryToProduct_AB_unique" ON "_CategoryToProduct"("A", "B");
CREATE INDEX "_CategoryToProduct_B_index" ON "_CategoryToProduct"("B");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
