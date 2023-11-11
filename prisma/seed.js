const {
  ApplicationStatus,
  PayFrequency,
  WorkMode,
  EmailStatus,
  PrismaClient,
} = require("@prisma/client");
const { faker, fa } = require("@faker-js/faker");
const { currenciesList } = require("./data/currenciesList");
const { countrySymbols } = require("./data/countrySymbols");

const getCountryCode = (country) => {
  const countrySymbol = countrySymbols[country];
  return countrySymbol || "US";
};

const getCurrencySymbol = (country) => {
  const countryCode = getCountryCode(country);
  return currenciesList[countryCode] || "USD";
};

const prisma = new PrismaClient();

const NUM_APPLICATION_CARDS = 10;

let applicationStatusIndex = 0;
const cycleApplicationStatus = () => {
  const statuses = Object.values(ApplicationStatus);
  return statuses[applicationStatusIndex++ % statuses.length];
};

let emailStatusIndex = 0;
const cycleEmailStatus = () => {
  const statuses = Object.values(EmailStatus);
  const randomIndex = Math.floor(emailStatusIndex++ % statuses.length);
  return statuses[randomIndex];
};

let payFrequencyIndex = 0;
const cyclePayFrequency = () => {
  const frequencies = Object.values(PayFrequency);
  const frequency = frequencies[payFrequencyIndex++ % frequencies.length];

  let amount;
  switch (frequency) {
    case PayFrequency.hourly:
      amount = faker.finance.amount(15, 60, 0); // Random hourly wage between $15 and $60
      break;
    case PayFrequency.weekly:
      amount = faker.finance.amount(500, 1500, 0); // Random weekly salary
      break;
    case PayFrequency.biweekly:
      amount = faker.finance.amount(1000, 3000, 0); // Random bi-weekly salary
      break;
    case PayFrequency.monthly:
      amount = faker.finance.amount(4000, 10000, 0); // Random monthly salary
      break;
    case PayFrequency.yearly:
      amount = faker.finance.amount(50000, 120000, 0); // Random yearly salary
      break;
    default:
      amount = 0;
  }

  return {
    frequency,
    amount: parseFloat(amount),
  };
};

let workModeIndex = 0;
const randomWorkMode = () => {
  const modes = Object.values(WorkMode);
  return modes[workModeIndex++ % modes.length];
};

const NUM_CONTACTS_PER_COMPANY = 3;

const resetDatabase = async () => {
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();
  await prisma.applicationCard.deleteMany();
  await prisma.job.deleteMany();
  await prisma.jobAddress.deleteMany();
  await prisma.userAddress.deleteMany();
  await prisma.companyAddress.deleteMany();
  await prisma.compensation.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.contactAddress.deleteMany();
  await prisma.contactAttribute.deleteMany();
  await prisma.email.deleteMany();
  await prisma.emailTemplate.deleteMany();
  await prisma.oAuth.deleteMany();
};

async function main() {
  resetDatabase();

  const user1 = await prisma.user.create({
    data: {
      email: "user1@example.com",
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      addresses: {
        create: {
          streetAddress: faker.location.streetAddress(),
          streetAddress2: faker.location.buildingNumber(),
          city: faker.location.city(),
          state: faker.location.state(),
          country: faker.location.country(),
        },
      },
    },
  });

  await prisma.oAuth.create({
    data: {
      userId: user1.id,
      provider: "google",
      externalId: "externalId1",
    },
  });

  const board1 = await prisma.applicationBoard.create({
    data: {
      name: "Seed Job Applications",
      userId: user1.id,
    },
  });

  const statusIndices = Object.values(ApplicationStatus).reduce(
    (acc, status) => {
      acc[status] = 0;
      return acc;
    },
    {}
  );

  for (let i = 0; i < NUM_APPLICATION_CARDS; i++) {
    const country = faker.location.country();
    const company = await prisma.company.create({
      data: {
        name: faker.company.name(),
        user: {
          connect: {
            id: user1.id,
          },
        },
        address: {
          create: {
            streetAddress: faker.location.streetAddress(),
            streetAddress2: faker.location.buildingNumber(),
            city: faker.location.city(),
            state: faker.location.state(),
            country: country,
          },
        },
      },
    });

    for (let j = 0; j < NUM_CONTACTS_PER_COMPANY; j++) {
      const contact = await prisma.contact.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          phone: faker.phone.number(),
          email: faker.internet.email(),
          company: {
            connect: {
              id: company.id,
            },
          },
          user: {
            connect: {
              id: user1.id,
            },
          },
          addresses: {
            create: {
              streetAddress: faker.location.streetAddress(),
              streetAddress2: faker.location.buildingNumber(),
              city: faker.location.city(),
              state: faker.location.state(),
              country: faker.location.country(),
            },
          },
        },
      });

      await prisma.email.create({
        data: {
          subject: "Initial Contact",
          body: faker.lorem.sentences(3),
          status: cycleEmailStatus(),
          contact: {
            connect: {
              id: contact.id,
            },
          },
          user: {
            connect: {
              id: user1.id,
            },
          },
        },
      });

      await prisma.contactAttribute.create({
        data: {
          name: "Preferred Communication",
          value: "Email",
          contact: {
            connect: {
              id: contact.id,
            },
          },
        },
      });

      await prisma.contactAttribute.create({
        data: {
          name: "Twitter Handle",
          value: faker.internet.userName(),
          contact: {
            connect: {
              id: contact.id,
            },
          },
        },
      });
    }

    await prisma.emailTemplate.create({
      data: {
        name: faker.lorem.sentence(),
        subject: faker.lorem.sentence(),
        body: faker.lorem.paragraph(),
        user: {
          connect: {
            id: user1.id,
          },
        },
      },
    });

    const currentStatus = cycleApplicationStatus();
    const { frequency, amount } = cyclePayFrequency();

    const job = await prisma.job.create({
      data: {
        title: faker.person.jobTitle(),
        description: faker.lorem.sentences(2),
        workMode: randomWorkMode(),
        company: {
          connect: {
            id: company.id,
          },
        },
        compensation: {
          create: {
            payAmount: amount,
            payFrequency: frequency,
            currency: getCurrencySymbol(country),
          },
        },
        user: {
          connect: {
            id: user1.id,
          },
        },
        address: {
          create: {
            streetAddress: faker.location.streetAddress(),
            streetAddress2: faker.location.buildingNumber(),
            city: faker.location.city(),
            state: faker.location.state(),
            country: country,
          },
        },
      },
    });

    await prisma.applicationCard.create({
      data: {
        applicationDate: faker.date.past({
          years: 1,
          refDate: new Date(),
        }),
        applicationLink: faker.internet.url(),
        job: {
          connect: {
            id: job.id,
          },
        },
        notes: faker.lorem.paragraph(),
        status: currentStatus,
        positionIndex: statusIndices[currentStatus],
        applicationBoard: {
          connect: {
            id: board1.id,
          },
        },
      },
    });

    statusIndices[currentStatus] += 1;
  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
