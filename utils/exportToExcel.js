import * as XLSX from "xlsx";

export function exportTopProductsToExcel(rows) {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Top10Products");
  XLSX.writeFile(workbook, "automotive-dashboard-top10.xlsx");
}
