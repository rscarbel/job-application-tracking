import prisma from "@/services/globalPrismaClient";
import { getRequestUser } from "@/services/userService";
import serverErrorResponse from "@/app/api/serverErrorResponse";

export async function GET(request) {
  const user = await getRequestUser(request);
  const userId = user?.id;

  if (!userId) {
    return serverErrorResponse("The request user does not exist", 404);
  }

  const companies = await prisma.company.findMany({
    where: {
      userId,
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
