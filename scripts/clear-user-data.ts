import prisma from '../lib/prisma';

async function clearUserData() {
  try {
    console.log("Starting to clear user data...");
    
    // Delete in reverse order of dependencies
    console.log("Deleting Journeys...");
    await prisma.journey.deleteMany({});
    
    console.log("Deleting ItineraryRequests...");
    await prisma.itineraryRequest.deleteMany({});
    
    console.log("Deleting Sessions...");
    await prisma.session.deleteMany({});
    
    console.log("Deleting Accounts...");
    await prisma.account.deleteMany({});
    
    console.log("Deleting VerificationTokens...");
    await prisma.verificationToken.deleteMany({});
    
    console.log("Deleting Users...");
    await prisma.user.deleteMany({});
    
    console.log("User data successfully cleared!");
  } catch (error) {
    console.error("Error clearing user data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

clearUserData();
