import prisma from "@/services/globalPrismaClient";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId || isNaN(parseInt(userId))) {
    return Response.json({
      status: 400,
      body: { error: "Invalid userId" },
    });
  }

  const companies = await prisma.company.findMany({
    where: {
      userId: parseInt(userId),
    },
    select: {
      name: true,
      id: true,
    },
  });

  return Response.json({
    body: companies.map((company) => ({
      name: company.name,
      companyId: company.id,
    })),
  });
}
