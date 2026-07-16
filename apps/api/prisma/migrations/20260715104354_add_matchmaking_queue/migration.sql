-- CreateTable
CREATE TABLE "matchmaking_queue" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ratingAtQueue" INTEGER NOT NULL,
    "timeControl" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matchmaking_queue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "matchmaking_queue_userId_key" ON "matchmaking_queue"("userId");

-- AddForeignKey
ALTER TABLE "matchmaking_queue" ADD CONSTRAINT "matchmaking_queue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
