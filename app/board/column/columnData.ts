export const columns: {
  id: string;
  title: string;
  applicationIds: number[];
}[] = [
  { id: "applied", title: "Applied", applicationIds: [] },
  { id: "interview", title: "Interview", applicationIds: [] },
  { id: "offer", title: "Offer", applicationIds: [] },
  { id: "rejected", title: "Rejected", applicationIds: [] },
  { id: "passed", title: "Passed", applicationIds: [] },
  { id: "accepted", title: "Accepted", applicationIds: [] },
];

export const columnOrder: string[] = [
  "applied",
  "interview",
  "offer",
  "rejected",
  "accepted",
  "passed",
];
