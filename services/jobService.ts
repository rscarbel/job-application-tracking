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
    include: {
      addresses: { orderBy: { fromDate: 'desc' }, take: 1 },
    },
  });

  if (existingJob) {
    const lastAddress = existingJob.addresses[0];
    const hasAddressChanged = lastAddress && (
      lastAddress.streetAddress !== address.streetAddress ||
      lastAddress.streetAddress2 !== address.streetAddress2 ||
      lastAddress.city !== address.city ||
      lastAddress.state !== address.state ||
      lastAddress.country !== address.country ||
      lastAddress.postalCode !== address.postalCode
    );

    if (hasAddressChanged) {
      await client.address.update({
        where: { id: lastAddress.id },
        data: { throughDate: new Date() },
      });

      await client.address.create({
        data: {
          ...address,
          jobId: existingJob.id,
        },
      });
    }

    return client.job.update({
      where: { id: existingJob.id },
      data: {
        description: description,
        compensation: {
          update: {
            ...compensation,
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
    include: {
      addresses: { orderBy: { fromDate: 'desc' }, take: 1 },
    },
  });

  if (!existingJob) {
    throw new Error("Job not found");
  }

  const lastAddress = existingJob.addresses[0];
  const hasAddressChanged = lastAddress && (
    lastAddress.streetAddress !== job.address.streetAddress ||
    lastAddress.streetAddress2 !== job.address.streetAddress2 ||
    lastAddress.city !== job.address.city ||
    lastAddress.state !== job.address.state ||
    lastAddress.country !== job.address.country ||
    lastAddress.postalCode !== job.address.postalCode
  );

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
      description: job.description,
      compensation: {
        update: {
          ...job.compensation,
        },
      },
    },
  });
};