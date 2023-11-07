import prisma from "@/services/globalPrismaClient";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getFormattedCardsForBoard } from "@/services/applicationCardService";
import TopMenu from "../TopMenu";
import "primereact/resources/themes/viva-light/theme.css";
import "primeicons/primeicons.css";

const getCardsForUser = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return [];

  const board = await prisma.applicationBoard.findFirst({
    where: { userId: user.id },
  });
  if (!board) return [];

  return await getFormattedCardsForBoard(board.id);
};

const Table = async () => {
  const cards = await getCardsForUser("user1@example.com");

  return (
    <>
      <TopMenu activeIndex={2} />
      <div className="p-8 bg-white shadow-md rounded-lg">
        <DataTable
          value={cards}
          className="text-gray-700"
          rowClassName="hover:bg-blue-50"
        >
          <Column
            field="jobTitle"
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
            field="payAmountCents"
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
    </>
  );
};

export default Table;
