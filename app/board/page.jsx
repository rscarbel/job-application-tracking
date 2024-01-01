import dynamic from "next/dynamic";
import prisma from "@/services/globalPrismaClient";
import { getFormattedCardsForBoard } from "@/services/applicationService";
import BoardSkeleton from "./boardSkeleton";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import options from "../api/auth/[...nextauth]/options";
import "primereact/resources/themes/viva-light/theme.css";
import "primeicons/primeicons.css";
import { calculateBoardStructure } from "@/app/api/applicationGroup/calculateBoardStructure";

const DynamicTextEditor = dynamic(() => import("./Board"), {
  ssr: false,
  loading: () => <BoardSkeleton />,
});

const getCardsForUser = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return [];

  const board = await prisma.applicationGroup.findFirst({
    where: { userId: user.id },
    orderBy: {
      createdAt: "desc",
    },
  });
  if (!board) return [];

  const cards = await getFormattedCardsForBoard(board.id);
  const boardData = calculateBoardStructure(cards);

  return boardData;
};

const Job = async () => {
  const session = await getServerSession(options);

  if (!session) {
    redirect("/api/auth/signin");
    return;
  }
  const userEmail = session.user.email;

  const board = await getCardsForUser(userEmail);

  return <DynamicTextEditor board={board} />;
};

export default Job;
