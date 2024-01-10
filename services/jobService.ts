import prisma from "@/services/globalPrismaClient";
import { JobInterface, TransactionClient } from "@/utils/types";
import { areAddressessIdentical } from "@/utils/data";

export const findOrCreateJob = async ({
  job,
  client = prisma,
}: {
  job: JobInterface;
  client?: typeof prisma | TransactionClient;
}) => {
  const existingJob = job.id
    ? await client.job.findUnique({
        where: {
          id: job.id,
        },
        include: {
          company: true,
          addresses: true,
          compensation: true,
        },
      })
    : await client.job.findFirst({
        where: {
          title: job.title,
          companyId: job.companyId,
          userId: job.userId,
          workMode: job.workMode,
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
        title: job.title,
        description: job.description,
        workMode: job.workMode,
        responsibilities: job.responsibilities,
        benefits: job.benefits,
        user: {
          connect: {
            id: job.userId,
          },
        },
        company: {
          connect: {
            id: job.companyId,
          },
        },
        addresses: {
          create: {
            ...job.address,
          },
        },
        compensation: {
          create: {
            ...job.compensation,
          },
        },
      },
    });
  }
};

export const createOrUpdateJob = async ({
  job,
  client = prisma,
}: {
  job: JobInterface;
  client?: typeof prisma | TransactionClient;
}) => {
  const existingJob = await client.job.findUnique({
    where: {
      id: job.id,
    },
    include: {
      addresses: { orderBy: { fromDate: "desc" }, take: 1 },
      compensation: true,
    },
  });

  if (existingJob) {
    const lastAddress = existingJob.addresses[0];
    const hasAddressChanged = areAddressessIdentical(lastAddress, job.address);

    if (hasAddressChanged) {
      await client.address.update({
        where: { id: lastAddress.id },
        data: { throughDate: new Date() },
      });

      await client.address.create({
        data: {
          ...job.address,
          jobId: existingJob.id,
        },
      });
    }

    return client.job.update({
      where: { id: existingJob.id },
      data: {
        description: job.description,
        responsibilities: job.responsibilities,
        benefits: job.benefits,
        compensation: {
          update: {
            ...job.compensation,
          },
        },
      },
    });
  } else {
    return client.job.create({
      data: {
        title: job.title,
        description: job.description,
        workMode: job.workMode,
        compensation: {
          create: {
            ...job.compensation,
          },
        },
        user: {
          connect: {
            id: job.userId,
          },
        },
        company: {
          connect: {
            id: job.companyId,
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
};

export const updateJob = async ({
  job,
  client = prisma,
}: {
  job: JobInterface;
  client?: typeof prisma | TransactionClient;
}) => {
  const existingJob = job.id
    ? await client.job.findUnique({
        where: {
          id: job.id,
        },
        include: {
          addresses: { orderBy: { fromDate: "desc" }, take: 1 },
          compensation: true,
        },
      })
    : await client.job.findFirst({
        where: {
          title: job.title,
          companyId: job.companyId,
          userId: job.userId,
          workMode: job.workMode,
        },
        include: {
          addresses: { orderBy: { fromDate: "desc" }, take: 1 },
        },
      });

  if (!existingJob) {
    throw new Error("Job not found");
  }

  const lastAddress = existingJob.addresses[0];
  const hasAddressChanged = areAddressessIdentical(lastAddress, job.address);

  if (hasAddressChanged) {
    await client.address.update({
      where: { id: lastAddress.id },
      data: { throughDate: new Date() },
    });

    await client.address.create({
      data: {
        ...job.address,
        jobId: existingJob.id,
      },
    });
  }

  return await client.job.update({
    where: {
      id: existingJob.id,
    },
    data: {
      title: job.title,
      responsibilities: job.responsibilities,
      companyId: job.companyId,
      workMode: job.workMode,
      description: job.description,
      compensation: {
        update: {
          ...job.compensation,
        },
      },
    },
  });
};
