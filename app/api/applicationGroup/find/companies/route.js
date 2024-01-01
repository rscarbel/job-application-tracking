import prisma from "@/services/globalPrismaClient";
import { getRequestUser } from "@/services/userService";
import { getToken } from "next-auth/jwt";
import unauthenticatedResponse from "@/app/api/unauthenticatedResponse";
import serverErrorResponse from "@/app/api/serverErrorResponse";

export async function GET(request) {
  const token = await getToken({ req: request });
  const { sub, provider } = token || { sub: null, provider: null };
  if (!sub || typeof provider !== "string") return unauthenticatedResponse;

  const user = await getRequestUser({ sub, provider });
  console.log(user);
  const userId = user.id;

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
