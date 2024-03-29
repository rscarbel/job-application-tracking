const {
  ApplicationStatus,
  PayFrequency,
  WorkMode,
  PrismaClient,
  CompanySize,
  CompanyType,
  CompanyDesireability,
} = require("@prisma/client");
const { faker } = require("@faker-js/faker");
const { currenciesList } = require("./data/currenciesList");
const { countrySymbols } = require("./data/countrySymbols");
const {
  createDocumentsForUser,
} = require("./seedHelpers/createDocumentsForUser");
const {
  createContactInteractions,
} = require("./seedHelpers/createContactInteractions");
let alternateCompensation = true;

const getRandomInteger = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const BENEFIT_NAMES = [
  "Health Insurance",
  "Dental Insurance",
  "Retirement Plan",
  "Paid Time Off",
  "Paid Holidays",
  "Remote Work",
  "Relocation Assistance",
  "Professional Development",
  "Tuition Reimbursement",
  "Employee Discounts",
  "Gym Membership",
  "Commuter Benefits",
  "Childcare",
  "Pet Insurance",
  "Stock Options",
];

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
const TAG_OPTIONS = ["Near Home", "Good Benefits", "Tech Industry"];

const getRandomDesireability = () => {
  const desireabilityValues = Object.values(CompanyDesireability).push(null);
  const randomIndex = getRandomInteger(0, desireabilityValues.length - 1);
  return desireabilityValues[randomIndex];
};

const generateCompanyDetails = () => {
  return {
    culture: faker.company.buzzVerb(),
    industry: faker.company.buzzNoun(),
    size: cycleCompanySize(),
    website: faker.internet.url(),
    type: cycleCompanyType(),
    history: faker.lorem.paragraph(),
    mission: faker.lorem.sentence(),
    vision: faker.lorem.sentence(),
    values: faker.lorem.words(5),
    description: faker.lorem.paragraphs(2),
  };
};

const generateJobResponsibilities = () => {
  const responsibilities = [];
  const numberOfResponsibilities = getRandomInteger(0, 10);
  for (let i = 0; i < numberOfResponsibilities; i++) {
    responsibilities.push(faker.lorem.sentence());
  }
  return responsibilities;
};

let applicationStatusIndex = 0;
const cycleApplicationStatus = () => {
  const statuses = Object.values(ApplicationStatus);
  return statuses[applicationStatusIndex++ % statuses.length];
};

let companySizeIndex = 0;
const cycleCompanySize = () => {
  const companySizes = Object.values(CompanySize);
  return companySizes[companySizeIndex++ % companySizes.length];
};

let companyTypeIndex = 0;
const cycleCompanyType = () => {
  const companyTypes = Object.values(CompanyType);
  return companyTypes[companyTypeIndex++ % companyTypes.length];
};

let payFrequencyIndex = 0;
const cyclePayFrequency = () => {
  const frequencies = Object.values(PayFrequency);
  const frequency = frequencies[payFrequencyIndex++ % frequencies.length];

  let amount;
  let rangeModifier;
  switch (frequency) {
    case PayFrequency.HOURLY:
      amount = getRandomInteger(15, 60); // Random hourly wage between $15 and $60
      rangeModifier = 5;
      break;
    case PayFrequency.WEEKLY:
      amount = getRandomInteger(500, 1500); // Random weekly salary
      rangeModifier = 100;
      break;
    case PayFrequency.BIWEEKLY:
      amount = getRandomInteger(1000, 3000); // Random bi-weekly salary
      rangeModifier = 200;
      break;
    case PayFrequency.MONTHLY:
      amount = getRandomInteger(4000, 10000); // Random monthly salary
      rangeModifier = 400;
      break;
    case PayFrequency.ANNUALLY:
      amount = getRandomInteger(50000, 120000); // Random yearly salary
      rangeModifier = 5000;
      break;
    default:
      amount = 0;
  }

  let salaryRangeMin = amount - rangeModifier;
  let salaryRangeMax = amount + rangeModifier;

  if (alternateCompensation) {
    salaryRangeMin = 0;
    salaryRangeMax = 0;
  } else {
    amount = 0;
  }

  alternateCompensation = !alternateCompensation;

  const negotiable = faker.datatype.boolean();

  return {
    frequency,
    amount: parseFloat(amount),
    salaryRangeMin: parseFloat(salaryRangeMin),
    salaryRangeMax: parseFloat(salaryRangeMax),
    negotiable,
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
  await prisma.applicationGroup.deleteMany();
  await prisma.interview.deleteMany();
  await prisma.document.deleteMany();
  await prisma.company.deleteMany();
  await prisma.companyDetail.deleteMany();
  await prisma.application.deleteMany();
  await prisma.applicationTag.deleteMany();
  await prisma.job.deleteMany();
  await prisma.address.deleteMany();
  await prisma.benefit.deleteMany();
  await prisma.jobBenefit.deleteMany();
  await prisma.jobAddress.deleteMany();
  await prisma.companyAddress.deleteMany();
  await prisma.compensation.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.contactAttribute.deleteMany();
  await prisma.contactInteraction.deleteMany();
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

  BENEFIT_NAMES.map(
    async (name) =>
      await prisma.benefit.create({
        data: {
          name,
          user: {
            connect: {
              id: user1.id,
            },
          },
        },
      })
  );

  await Promise.all(
    TAG_OPTIONS.map(async (tag) => {
      return await prisma.applicationTag.create({
        data: {
          value: tag,
          userId: user1.id,
        },
      });
    })
  );

  await createDocumentsForUser(user1.id, prisma);

  await prisma.oAuth.create({
    data: {
      userId: user1.id,
      provider: "google",
      externalId: "externalId1",
    },
  });

  const group1 = await prisma.applicationGroup.create({
    data: {
      name: "Initial group",
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
    const companyDetails = generateCompanyDetails();
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
            country: faker.location.country(),
          },
        },
        details: {
          create: {
            ...companyDetails,
          },
        },
        preferences: {
          create: {
            desireability: getRandomDesireability(),
            notes: faker.lorem.sentences(3),
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

      await createContactInteractions(contact.id, prisma);

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
    const { frequency, amount, salaryRangeMin, salaryRangeMax, negotiable } =
      cyclePayFrequency();

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
            salaryRangeMin: salaryRangeMin,
            salaryRangeMax: salaryRangeMax,
            negotiable: negotiable,
            user: {
              connect: {
                id: user1.id,
              },
            },
          },
        },
        responsibilities: generateJobResponsibilities(),
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
            country: faker.location.country(),
          },
        },
      },
    });

    const allBenefits = await prisma.benefit.findMany();

    const numBenefits = getRandomInteger(0, allBenefits.length);

    const benefits = allBenefits
      .sort(() => 0.5 - Math.random())
      .slice(0, numBenefits)
      .map((benefit) => ({ id: benefit.id }));

    const createdTags = await prisma.applicationTag.findMany();

    const numTags = getRandomInteger(0, createdTags.length);

    const tags = createdTags
      .sort(() => 0.5 - Math.random())
      .slice(0, numTags)
      .map((tag) => ({ id: tag.id }));

    await prisma.jobBenefit.createMany({
      data: benefits.map((benefit) => ({
        jobId: job.id,
        benefitId: benefit.id,
      })),
    });

    const application = await prisma.application.create({
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
        applicationGroup: {
          connect: {
            id: group1.id,
          },
        },
        user: {
          connect: {
            id: user1.id,
          },
        },
      },
    });

    await prisma.applicationApplicationTag.createMany({
      data: tags.map((tag) => ({
        applicationId: application.id,
        tagId: tag.id,
      })),
    });

    if (currentStatus !== ApplicationStatus.APPLIED) {
      const numInterviews = getRandomInteger(1, 2);

      for (let k = 0; k < numInterviews; k++) {
        await prisma.interview.create({
          data: {
            application: {
              connect: {
                id: application.id,
              },
            },
            scheduledTime: faker.date.future(),
            location: faker.location.city(),
            notes: faker.lorem.sentence(),
            feedback: faker.lorem.sentences(2),
            user: {
              connect: {
                id: user1.id,
              },
            },
          },
        });
      }
    }

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
