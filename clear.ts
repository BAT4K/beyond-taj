import prisma from './lib/prisma'; prisma.transitRoute.deleteMany().then(() => console.log('cleared'));
