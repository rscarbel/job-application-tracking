import prisma from "@/services/globalPrismaClient";
import { WorkMode } from "@prisma/client";

export const findOrCreateJob = async ({
  jobTitle,
  userId,
  companyId,
  jobDescription,
  workMode,
  payAmount,
  payFrequency,
  currency,
  addressProperties,
  client = prisma,
}) => {
  const existingJob = await client.job.findFirst({
    where: {
      title: jobTitle,
      companyId: companyId,
      userId: userId,
      workMode: workMode,
    },
  });
  if (existingJob) {
    return existingJob;
  } else {
    return await client.job.create({
      data: {
        title: jobTitle,
        description: jobDescription,
        workMode: workMode,
        payAmount: payAmount,
        payFrequency: payFrequency,
        currency: currency,
        user: {
          connect: {
            id: userId,
          },
        },
        company: {
          connect: {
            id: companyId,
          },
        },
        address: {
          create: {
            ...addressProperties,
          },
        },
      },
    });
  }
};

export const createOrUpdateJob = async ({
  jobTitle,
  userId,
  companyId,
  jobDescription = "",
  workMode = WorkMode.onsite,
  payAmount,
  payFrequency,
  currency,
  addressProperties,
  client = prisma,
}) => {
  const existingJob = await client.job.findFirst({
    where: {
      title: jobTitle,
      companyId: companyId,
      userId: userId,
      workMode: workMode,
    },
  });

  if (existingJob) {
    return client.job.update({
      where: { id: existingJob.id },
      data: {
        description: jobDescription,
        payAmount: payAmount,
        payFrequency: payFrequency,
        currency: currency,
        address: {
          update: {
            ...addressProperties,
          },
        },
      },
    });
  } else {
    return client.job.create({
      data: {
        title: jobTitle,
        description: jobDescription,
        workMode: workMode,
        payAmount: payAmount,
        payFrequency: payFrequency,
        currency: currency,
        user: {
          connect: {
            id: userId,
          },
        },
        company: {
          connect: {
            id: companyId,
          },
        },
        address: {
          create: {
            ...addressProperties,
          },
        },
      },
    });
  }
};

export const updateJob = async ({
  jobId,
  jobTitle,
  jobDescription,
  workMode,
  payAmount,
  payFrequency,
  currency,
  streetAddress,
  streetAddress2,
  city,
  state,
  country,
  postalCode,
  client = prisma,
}) => {
  const job = await client.job.findFirst({
    where: {
      id: jobId,
    },
  });

  if (!job) {
    throw new Error("Job not found");
  }

  return await client.job.update({
    where: {
      id: jobId,
    },
    data: {
      title: jobTitle,
      description: jobDescription,
      workMode: workMode,
      payAmount: payAmount,
      payFrequency: payFrequency,
      currency: currency,
      address: {
        update: {
          streetAddress: streetAddress,
          streetAddress2: streetAddress2,
          city: city,
          state: state,
          country: country,
          postalCode: postalCode,
        },
      },
    },
  });
};
