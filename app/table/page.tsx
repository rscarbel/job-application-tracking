import prisma from "@/services/globalPrismaClient";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getFormattedCardsForBoard } from "@/services/applicationService";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import options from "../api/auth/[...nextauth]/options";
import "primereact/resources/themes/viva-light/theme.css";
import "primeicons/primeicons.css";
import { prettifyDate } from "@/utils/global";

const getCardsForUser = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return [];

  const board = await prisma.applicationGroup.findFirst({
    where: { userId: user.id },
    orderBy: {
      createdAt: "desc",
    },
  });
  if (!board) return [];

  const cards = await getFormattedCardsForBoard({ groupId: board.id });

  // server components don't support passing in functions to the body prop
  // so we need to format the date here
  const formattedCards = cards.map((card) => ({
    ...card,
    applicationDate: prettifyDate(card.applicationDate),
  }));

  return formattedCards;
};

const Table = async () => {
  // @ts-ignore - there is a capability problem with the types in next-auth. The options are valid but typescript can't validate them.
  const session = await getServerSession(options);

  if (!session) {
    redirect("/api/auth/signin");
    return;
  }

  const userEmail: string | null | undefined = session?.user?.email;
  const cards = await getCardsForUser(userEmail || "");

  return (
    <div className="p-8 bg-white shadow-md rounded-lg">
      <DataTable
        value={cards}
        className="text-gray-700"
        // @ts-ignore - PrimeReact types are not up to date
        rowClassName="hover:bg-blue-50"
      >
        <Column
          field="title"
          header="Job Title"
          sortable
          headerClassName="font-semibold"
        />
        <Column
          field="companyName"
          header="Company Name"
          sortable
          headerClassName="font-semibold"
        />
        <Column
          field="status"
          header="Status"
          sortable
          headerClassName="font-semibold"
        />
        <Column
          field="workMode"
          header="Work Mode"
          sortable
          headerClassName="font-semibold"
        />
        <Column
          field="payAmount"
          header="Pay Amount"
          sortable
          headerClassName="font-semibold"
        />
        <Column
          field="payFrequency"
          header="Pay Frequency"
          sortable
          headerClassName="font-semibold"
        />
        <Column
          field="applicationDate"
          filterField="date"
          sortable
          header="Application Date"
          headerClassName="font-semibold"
        />
        <Column
          field="city"
          header="City"
          sortable
          headerClassName="font-semibold"
        />
      </DataTable>
    </div>
  );
};

export default Table;
