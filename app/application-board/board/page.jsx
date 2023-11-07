import dynamic from "next/dynamic";
import prisma from "@/services/globalPrismaClient";
import { getFormattedCardsForBoard } from "@/services/applicationCardService";
import BoardSkeleton from "./boardSkeleton";
import TopMenu from "../TopMenu";
import "primereact/resources/themes/viva-light/theme.css";
import "primeicons/primeicons.css";
import { calculateBoardStructure } from "@/app/api/applicationBoard/calculateBoardStructure";

const DynamicTextEditor = dynamic(() => import("./Board"), {
  ssr: false,
  loading: () => <BoardSkeleton />,
});

const getCardsForUser = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return [];

  const board = await prisma.applicationBoard.findFirst({
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
  const board = await getCardsForUser("user1@example.com");

  return (
    <>
      <TopMenu />
      <DynamicTextEditor board={board} />
    </>
  );
};

export default Job;
