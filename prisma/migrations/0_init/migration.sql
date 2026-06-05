-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "DestinationCluster" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hubCities" TEXT[],
    "compatibleClusters" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DestinationCluster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Destination" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "idealSeason" TEXT NOT NULL,
    "vibeTags" TEXT[],
    "peakMonths" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "shoulderMonths" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "avoidMonths" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "closedMonths" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "minRequiredDays" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clusterId" TEXT,
    "altitude" DOUBLE PRECISION,
    "requiresAcclimatization" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "isHub" BOOLEAN NOT NULL DEFAULT false,
    "shortPitch" TEXT NOT NULL DEFAULT '',
    "topHighlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "imageUrl" TEXT,

    CONSTRAINT "Destination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItineraryRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "selectedDays" INTEGER NOT NULL,
    "budgetStyle" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItineraryRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Landscape" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Landscape_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransitRoute" (
    "id" TEXT NOT NULL,
    "originId" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "travelMode" TEXT NOT NULL,
    "durationHours" DOUBLE PRECISION NOT NULL,
    "distanceKm" DOUBLE PRECISION NOT NULL,
    "fatigueCost" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "seasonal" BOOLEAN NOT NULL DEFAULT false,
    "openMonths" INTEGER[],
    "isFlight" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransitRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "passwordHash" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Journey" (
    "id" TEXT NOT NULL,
    "days" INTEGER NOT NULL,
    "travelStyle" TEXT NOT NULL,
    "residency" TEXT NOT NULL DEFAULT 'International',
    "startLocation" TEXT NOT NULL DEFAULT '',
    "landscapes" TEXT[],
    "destinations" JSONB NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "itinerary" JSONB,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Journey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DestinationLandscapes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DestinationLandscapes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ItineraryDestinations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ItineraryDestinations_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ItineraryLandscapes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ItineraryLandscapes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Landscape_name_key" ON "Landscape"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TransitRoute_originId_destinationId_key" ON "TransitRoute"("originId", "destinationId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "_DestinationLandscapes_B_index" ON "_DestinationLandscapes"("B");

-- CreateIndex
CREATE INDEX "_ItineraryDestinations_B_index" ON "_ItineraryDestinations"("B");

-- CreateIndex
CREATE INDEX "_ItineraryLandscapes_B_index" ON "_ItineraryLandscapes"("B");

-- AddForeignKey
ALTER TABLE "Destination" ADD CONSTRAINT "Destination_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "DestinationCluster"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItineraryRequest" ADD CONSTRAINT "ItineraryRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransitRoute" ADD CONSTRAINT "TransitRoute_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransitRoute" ADD CONSTRAINT "TransitRoute_originId_fkey" FOREIGN KEY ("originId") REFERENCES "Destination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Journey" ADD CONSTRAINT "Journey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DestinationLandscapes" ADD CONSTRAINT "_DestinationLandscapes_A_fkey" FOREIGN KEY ("A") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DestinationLandscapes" ADD CONSTRAINT "_DestinationLandscapes_B_fkey" FOREIGN KEY ("B") REFERENCES "Landscape"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItineraryDestinations" ADD CONSTRAINT "_ItineraryDestinations_A_fkey" FOREIGN KEY ("A") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItineraryDestinations" ADD CONSTRAINT "_ItineraryDestinations_B_fkey" FOREIGN KEY ("B") REFERENCES "ItineraryRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItineraryLandscapes" ADD CONSTRAINT "_ItineraryLandscapes_A_fkey" FOREIGN KEY ("A") REFERENCES "ItineraryRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItineraryLandscapes" ADD CONSTRAINT "_ItineraryLandscapes_B_fkey" FOREIGN KEY ("B") REFERENCES "Landscape"("id") ON DELETE CASCADE ON UPDATE CASCADE;

