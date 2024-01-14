import { reportError } from "./reportError";
import serverErrorResponse from "../serverErrorResponse";
import { getRequestUser } from "@/services/userService";
import { NextApiRequest } from "next";

export async function POST(request: NextApiRequest): Promise<Response> {
  try {
    const { error } = await request.body.json();
    const user = await getRequestUser(request);
    reportError(error, user);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to report to Bugsnag:", error);
    return serverErrorResponse("Failed to report error", 500);
  }
}
