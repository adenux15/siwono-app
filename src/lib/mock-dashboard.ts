export const dashboardData = {
  summary: {
    totalArchives: 124592,
    addedThisMonth: 142,
    availableArchives: 124150,
    availabilityPercentage: 99.6,
    currentlyBorrowed: 442,
    lateReturns: 12
  },
  shelves: {
    yuridis: [
      { id: "A1", fill: 85 },
      { id: "A2", fill: 92 },
      { id: "A3", fill: 45 },
      { id: "A4", fill: 78 },
      { id: "A5", fill: 60 },
      { id: "A6", fill: 30 },
      { id: "A7", fill: 95 },
      { id: "A8", fill: 68 },
    ],
    fisik1: [
      { id: "C1", fill: 50 },
      { id: "C2", fill: 75 },
      { id: "C3", fill: 40 },
      { id: "C4", fill: 20 },
      { id: "C5", fill: 88 },
      { id: "C6", fill: 91 },
      { id: "C7", fill: 35 },
      { id: "C8", fill: 60 },
    ]
  },
  recentLoans: [
    {
      id: "P-2023-001",
      borrower: "Budi Santoso",
      document: "SHM 1234/Lamongan",
      status: "late",
      dueDate: "2023-10-25T10:00:00Z"
    },
    {
      id: "P-2023-002",
      borrower: "Siti Aminah",
      document: "SHM 5678/Paciran",
      status: "active",
      dueDate: "2023-11-01T14:30:00Z"
    },
    {
      id: "P-2023-003",
      borrower: "Andi Saputra",
      document: "HGB 910/Babat",
      status: "active",
      dueDate: "2023-10-31T09:00:00Z"
    },
    {
      id: "P-2023-004",
      borrower: "Rina Wati",
      document: "SHM 1112/Tikung",
      status: "active",
      dueDate: "2023-10-30T15:00:00Z"
    }
  ],
  recentInputs: [
    {
      id: "I-2023-001",
      processor: "Ahmad",
      document: "SHM 9999/Brondong",
      time: "2023-10-27T08:15:00Z",
      status: "completed"
    },
    {
      id: "I-2023-002",
      processor: "Dewi",
      document: "SHM 8888/Deket",
      time: "2023-10-27T09:45:00Z",
      status: "processing"
    }
  ]
}
