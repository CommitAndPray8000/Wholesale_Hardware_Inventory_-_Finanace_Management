/**
 * Wholesale Hardware Management Platform
 * Interactive Frontend Engine
 */

// Initial Hardware Dataset
const INITIAL_INVENTORY_DATA = [
  {
    id: 1,
    sku: "HW-DRL-201",
    name: "DeWalt 20V MAX XR Hammer Drill",
    category: "Power Tools",
    location: "Bay A-04",
    stock: 4,
    minThreshold: 20,
    cost: 119.50,
    contractorPrice: 159.00,
    bulkPrice: 145.00,
    msrp: 199.00,
    supplier: "DeWalt Industrial Tool Co."
  },
  {
    id: 2,
    sku: "HW-SCR-884",
    name: "3-Inch Zinc Galvanized Wood Screws (500-pk)",
    category: "Fasteners",
    location: "Bay B-12",
    stock: 6,
    minThreshold: 45,
    cost: 14.20,
    contractorPrice: 21.50,
    bulkPrice: 18.00,
    msrp: 29.99,
    supplier: "Fastener Express Ltd"
  },
  {
    id: 3,
    sku: "HW-VLV-102",
    name: "Brass Ball Valve 3/4\" Full Port Lead-Free",
    category: "Plumbing",
    location: "Bay C-02",
    stock: 3,
    minThreshold: 30,
    cost: 8.75,
    contractorPrice: 13.90,
    bulkPrice: 11.20,
    msrp: 18.50,
    supplier: "Midwest Valve & Fitting"
  },
  {
    id: 4,
    sku: "HW-CBL-441",
    name: "12/2 NM-B Romex Copper Electrical Wire (250ft)",
    category: "Electrical",
    location: "Bay D-01",
    stock: 58,
    minThreshold: 25,
    cost: 88.00,
    contractorPrice: 118.00,
    bulkPrice: 104.00,
    msrp: 142.00,
    supplier: "Southwire Electrical Supply"
  },
  {
    id: 5,
    sku: "HW-SAW-309",
    name: "Milwaukee M18 FUEL Reciprocating Sawzall",
    category: "Power Tools",
    location: "Bay A-09",
    stock: 22,
    minThreshold: 15,
    cost: 145.00,
    contractorPrice: 189.00,
    bulkPrice: 172.00,
    msrp: 239.00,
    supplier: "Milwaukee Electric Tool"
  },
  {
    id: 6,
    sku: "HW-ANC-512",
    name: "Heavy-Duty Wedge Anchor Bolts 1/2\" x 4-1/4\" (50pk)",
    category: "Fasteners",
    location: "Bay B-06",
    stock: 74,
    minThreshold: 40,
    cost: 32.50,
    contractorPrice: 48.00,
    bulkPrice: 42.00,
    msrp: 64.00,
    supplier: "Hilti Anchor Systems"
  },
  {
    id: 7,
    sku: "HW-PIP-220",
    name: "Type L Copper Pipe 1/2\" x 10ft Rigid Hard Temper",
    category: "Plumbing",
    location: "Bay C-11",
    stock: 110,
    minThreshold: 50,
    cost: 16.40,
    contractorPrice: 24.50,
    bulkPrice: 21.00,
    msrp: 33.00,
    supplier: "Mueller Industries"
  },
  {
    id: 8,
    sku: "HW-BRK-901",
    name: "Square D 20-Amp Single-Pole Circuit Breaker",
    category: "Electrical",
    location: "Bay D-08",
    stock: 0,
    minThreshold: 35,
    cost: 6.20,
    contractorPrice: 9.80,
    bulkPrice: 8.50,
    msrp: 14.50,
    supplier: "Schneider Electric"
  },
  {
    id: 9,
    sku: "HW-GLV-045",
    name: "Level 4 Cut-Resistant Work Gloves (12-Pair Pack)",
    category: "Safety & PPE",
    location: "Bay E-03",
    stock: 85,
    minThreshold: 30,
    cost: 26.00,
    contractorPrice: 39.00,
    bulkPrice: 34.00,
    msrp: 52.00,
    supplier: "Ansell Protective Solutions"
  },
  {
    id: 10,
    sku: "HW-GRN-112",
    name: "Makita 4-1/2\" Paddle Switch Angle Grinder",
    category: "Power Tools",
    location: "Bay A-02",
    stock: 31,
    minThreshold: 15,
    cost: 72.00,
    contractorPrice: 98.00,
    bulkPrice: 89.00,
    msrp: 124.00,
    supplier: "Makita USA"
  }
];
let inventoryData = JSON.parse(JSON.stringify(INITIAL_INVENTORY_DATA));

// Initial Ledger Dataset (Credit & Debt)
const INITIAL_LEDGER_DATA = [
  {
    id: 1,
    type: "Credit", // Contractor Receivable
    party: "Apex Construction Corp",
    ref: "INV-CR-409",
    amount: 18450.00,
    paid: 12000.00,
    dueDate: "2026-11-15",
    terms: "Net 30",
    notes: "Commercial fasteners, hammer drills & bulk framing anchors",
    status: "Partial"
  },
  {
    id: 2,
    type: "Debt", // Supplier Payable
    party: "DeWalt Industrial Tool Co.",
    ref: "PO-DB-881",
    amount: 24500.00,
    paid: 15000.00,
    dueDate: "2026-11-20",
    terms: "Net 60",
    notes: "Q4 20V Max cordless tools restock shipment",
    status: "Partial"
  },
  {
    id: 3,
    type: "Credit",
    party: "Miller Electrical Contractors",
    ref: "INV-CR-398",
    amount: 9200.00,
    paid: 0.00,
    dueDate: "2026-11-05",
    terms: "Net 30",
    notes: "12/2 Romex copper spools and breaker panels",
    status: "Outstanding"
  },
  {
    id: 4,
    type: "Debt",
    party: "Southwire Electrical Supply",
    ref: "PO-DB-872",
    amount: 14800.00,
    paid: 14800.00,
    dueDate: "2026-10-25",
    terms: "Net 30",
    notes: "High voltage electrical conduits & wiring pallets",
    status: "Settled"
  },
  {
    id: 5,
    type: "Credit",
    party: "Summit Plumbing & Heating LLC",
    ref: "INV-CR-384",
    amount: 7350.00,
    paid: 3000.00,
    dueDate: "2026-10-20",
    terms: "Net 15",
    notes: "Type L rigid copper pipes and full port brass ball valves",
    status: "Overdue"
  },
  {
    id: 6,
    type: "Debt",
    party: "Makita USA Corporate",
    ref: "PO-DB-866",
    amount: 12600.00,
    paid: 6000.00,
    dueDate: "2026-11-30",
    terms: "Net 45",
    notes: "Paddle switch angle grinders & diamond blades batch",
    status: "Partial"
  },
  {
    id: 7,
    type: "Credit",
    party: "Horizon Builders Guild",
    ref: "INV-CR-415",
    amount: 16800.00,
    paid: 16800.00,
    dueDate: "2026-11-10",
    terms: "Net 30",
    notes: "Heavy duty steel wedge anchors and galvanized wood screws",
    status: "Settled"
  },
  {
    id: 8,
    type: "Debt",
    party: "Mueller Industries Valves",
    ref: "PO-DB-859",
    amount: 8900.00,
    paid: 0.00,
    dueDate: "2026-11-18",
    terms: "Net 30",
    notes: "Commercial grade brass shutoff valves and fitting couplers",
    status: "Outstanding"
  }
];
let ledgerData = JSON.parse(JSON.stringify(INITIAL_LEDGER_DATA));

// State variables
let currentTab = "dashboard";
let selectedCategory = "All";
let selectedStockStatus = "All";
let currentLedgerFilter = "all"; // 'all', 'credit', 'debt'
let selectedLedgerStatus = "All";
let searchTerm = "";
let editingItemId = null;
let settlingLedgerId = null;

// Application Bootstrap
