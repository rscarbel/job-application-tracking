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
import { BoardStructureInterface } from "../api/applicationGroup/BoardStructureInterface";

const DEFAULT_EMPTY_BOARD: BoardStructureInterface = {
  applications: {},
  columns: {},
  columnOrder: [],
};

const boardIsEmpty: (board: BoardStructureInterface) => boolean = (board) => {
  return Object.keys(board.applications).length === 0;
};

const DynamicTextEditor = dynamic(() => import("./Board"), {
  ssr: false,
  loading: () => <BoardSkeleton />,
});

const getCardsForUser = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return DEFAULT_EMPTY_BOARD;

  const board = await prisma.applicationGroup.findFirst({
    where: { userId: user.id },
    orderBy: {
      createdAt: "desc",
    },
  });
  if (!board) return DEFAULT_EMPTY_BOARD;

  const cards = await getFormattedCardsForBoard({ groupId: board.id });
  const boardData = calculateBoardStructure(cards);

  return boardData;
};

const Job = async () => {
  // @ts-ignore - there is a capability problem with the types in next-auth. The options are valid but typescript can't validate them.
  const session = await getServerSession(options);

  if (!session) {
    redirect("/api/auth/signin");
    return;
  }

  const userEmail = session?.user?.email;
  const board = await getCardsForUser(userEmail || "");

  if (boardIsEmpty(board)) {
    redirect("/create-card");
    return;
  }

  return <DynamicTextEditor board={board} />;
};

export default Job;
