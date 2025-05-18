"use strict";
// import { Worker } from 'bullmq';
// import { PrismaClient } from '@prisma/client';
// import IORedis from 'ioredis';
// import { getMonth, getYear } from 'date-fns';
// const prisma = new PrismaClient();
// const connection = new IORedis();
// export const billingWorker = new Worker(
//   'billing',
//   async (job) => {
//     const { membershipId } = job.data;
//     const member = await prisma.members.findFirst({
//       where: {
//         membershipId,
//         membershipStatus: 'ACTIVE',
//       },
//     });
//     if (!member) {
//       console.log(`[BillingWorker] Skipped ${membershipId}, not active`);
//       return;
//     }
//     const dueDate = member.nextDueDate ? new Date(member.nextDueDate) : new Date();
//     const month = getMonth(dueDate) + 1;
//     const year = getYear(dueDate);
//     const existing = await prisma.membersTransactionHistory.findUnique({
//       where: {
//         membershipId_month_year: {
//           membershipId,
//           month,
//           year,
//         },
//       },
//     });
//     if (existing) {
//       console.log(`[BillingWorker] Bill already exists for ${membershipId} (${month}/${year})`);
//       return;
//     }
//     await prisma.membersTransactionHistory.create({
//       data: {
//         membershipId,
//         month,
//         year,
//         amount: member.subscriptionAmount, // Replace with actual billing logic
//       },
//     });
//     console.log(`[BillingWorker] Bill created for ${membershipId} (${month}/${year})`);
//   },
//   {
//     concurrency: 5,
//     connection,
//   }
// );
// // Error logging
// billingWorker.on('failed', (job:any, err:any) => {
//   console.error(`[BillingWorker] Job ${job.id} failed for ${job.data.membershipId}:`, err.message);
// });
