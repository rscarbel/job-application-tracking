const { ContactInteractionType } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const getRandomInteger = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

let contactInteractionIndex = 0;
const cycleContactInteractionType = () => {
  const interactionTypes = Object.values(ContactInteractionType);
  return interactionTypes[contactInteractionIndex++ % interactionTypes.length];
};

const createContactInteractions = async (contactId, client) => {
  const shouldCreateInteraction = Math.round(Math.random());
  if (!shouldCreateInteraction) return;

  const numInteractions = getRandomInteger(1, 3);
  for (let i = 0; i < numInteractions; i++) {
    const interactionType = cycleContactInteractionType();
    await client.contactInteraction.create({
      data: {
        contactId,
        type: interactionType,
        notes: faker.lorem.sentence(),
        interactionTime: faker.date.past(),
      },
    });
  }
};

exports.createContactInteractions = createContactInteractions;
