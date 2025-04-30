// Datos simulados para la tabla de facturas

export interface InvoiceData {
  id: number
  header: string
  type: string
  status: 'Done' | 'In Progress' | 'Not Started'
  target: string
  limit: string
  reviewer: string
}

export const mockData: InvoiceData[] = [
  { id: 1, header: "Introduction", type: "Table of Contents", status: "Done", target: "100", limit: "200", reviewer: "Eddie Lake" },
  { id: 2, header: "Summary", type: "Executive Summary", status: "In Progress", target: "150", limit: "300", reviewer: "Assign reviewer" },
  { id: 3, header: "Approach", type: "Technical Approach", status: "Not Started", target: "200", limit: "400", reviewer: "Assign reviewer" },
  { id: 4, header: "Design", type: "Design", status: "Done", target: "120", limit: "240", reviewer: "Jamik Tashpulatov" },
]