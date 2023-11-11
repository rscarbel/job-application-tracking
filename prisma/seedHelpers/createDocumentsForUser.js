const { DocumentType } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const createDocumentsForUser = async (userId, client) => {
  let usesURL = Math.round(Math.random());

  const documentTypes = Object.values(DocumentType);
  for (const type of documentTypes) {
    const url = usesURL ? faker.internet.url() : undefined;
    const content = usesURL ? undefined : faker.lorem.paragraphs(2);
    usesURL = !usesURL;

    await client.document.create({
      data: {
        user: { connect: { id: userId } },
        type: type,
        url: url,
        name: `${type.toLowerCase()}-${faker.lorem.word()}.pdf`,
        content: content,
      },
    });
  }
};

exports.createDocumentsForUser = createDocumentsForUser;
