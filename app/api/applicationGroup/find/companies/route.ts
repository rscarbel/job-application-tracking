import prisma from "@/services/globalPrismaClient";
import { getCurrentUser } from "@/services/UserManagement";
import serverErrorResponse from "@/app/api/serverErrorResponse";
import { ApiRequest } from "@/utils/ApiRequestType";

export async function GET(request: ApiRequest) {
  const user = await getCurrentUser(request);
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
