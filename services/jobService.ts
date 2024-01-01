import prisma from "@/services/globalPrismaClient";
import { WorkModeEnum, JobInterface, CompanyDetailInterface, AddressInterface, ApplicationCardInterface, BenefitTypeEnum } from "@/utils/types";

export const findOrCreateJob = async ({
  job: {
    title,
    responsibilities,
    benefits,
    userId,
    companyId,
    description,
    workMode,
    compensation,
    address
  },
  client = prisma,
}: {
  job: JobInterface,
  client?: typeof prisma;
}) => {

  const existingJob = await client.job.findFirst({
    where: {
      title,
      companyId,
      userId,
      workMode,
    },
    include: {
      company: true,
      addresses: true,
      compensation: true,
    },
  });

  if (existingJob) {
    return existingJob;
  } else {
    return await client.job.create({
      data: {
        title,
        description,
        workMode,
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
        addresses: {
          create: {
            ...address,
          },
        },
      },
    });
  }
};

export const createOrUpdateJob = async ({
  job: {
    title,
    userId,
    companyId,
    description,
    workMode,
    compensation,
    address,
  },
  client = prisma,
}: {
  job: JobInterface,
  client?: typeof prisma;
}) => {
  const existingJob = await client.job.findFirst({
    where: {
      title: title,
      companyId: companyId,
      userId: userId,
      workMode: workMode,
    },
  });

  if (existingJob) {
    return client.job.update({
      where: { id: existingJob.id },
      data: {
        description: description,
        compensation: {
          update: {
            ...compensation,
          },
        },
        addresses: {
          create: {
            ...address,
          },
        },
      },
    });
  } else {
    return client.job.create({
      data: {
        title,
        description,
        workMode,
        compensation: {
          create: {
            ...compensation,
          },
        },
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
        addresses: {
          create: {
            ...address,
          },
        },
      },
    });
  }
};

export const updateJob = async ({
  job,
  client = prisma,
}: {
  job: JobInterface,
  client?: typeof prisma;
}) => {
  const existingJob = await client.job.findFirst({
    where: {
      title: job.title,
      companyId: job.companyId,
      userId: job.userId,
      workMode: job.workMode,
    },
  });

  if (!existingJob) {
    throw new Error("Job not found");
  }

  return await client.job.update({
    where: {
      id: existingJob.id,
    },
    data: {
      description: job.description,
      compensation: {
        update: {
          ...job.compensation,
        },
      },
      addresses: {
        create: {
          ...job.address,
        },
      },
    },
  });
}