import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import StraightIcon from "@mui/icons-material/Straight";
import SouthIcon from "@mui/icons-material/South";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import { useState, useEffect } from "react";

const GenericTable = ({
  title = "",
  columns = [],
  rows = [],
  onRowClick = () => {},
  onRemove = () => {},
}) => {
  const [tableRows, setTableRows] = useState([]);
  const [sorted, setSorted] = useState({ key: "", direction: "asc" });

  // load rows when props change
  useEffect(() => {
    setTableRows(rows);
  }, [rows]);

  console.log("tableRows{}{}", tableRows);

  // sorting logic
  const handleSorting = (key) => {
    const direction =
      sorted.key === key && sorted.direction === "asc" ? "dsc" : "asc";

    const sortedData = [...tableRows].sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];

      if (valueA < valueB) return direction === "asc" ? -1 : 1;
      if (valueA > valueB) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSorted({ key, direction });
    setTableRows(sortedData);
  };

  console.log("columns----", columns);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {title && <h1>{title}</h1>}

      <TableContainer
        sx={{
          width: "75%",

          border: 1,
          borderRadius: 4,
        }}
      >
        <Table>
          <TableHead
            sx={{
              bgcolor: "#16035aff",
              "& .MuiTableCell-root": {
                color: "#fff",
                fontSize: "1rem",
                fontWeight: 600,
              },
            }}
          >
            <TableRow>
              {columns?.map((col) => {
                console.log(col,"col:::")
                return (
                  <TableCell
                    key={col.key}
                    onClick={() => col.sortable && handleSorting(col.key)}
                    sx={{ cursor: col.sortable ? "pointer" : "default" }}
                  >
                    {col.label}

                    {col.sortable && sorted.key !== col.key && (
                      <ImportExportIcon sx={{ fontSize: "0.9rem", ml: 1 }} />
                    )}

                    {sorted.key === col.key &&
                      (sorted.direction === "asc" ? (
                        <StraightIcon sx={{ fontSize: "0.9rem", ml: 1 }} />
                      ) : (
                        <SouthIcon sx={{ fontSize: "0.8rem", ml: 1 }} />
                      ))}
                  </TableCell>
                );
              })}

              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tableRows.map((row, ind) => (
              <TableRow
                key={ind}
                onClick={() => onRowClick(row)}
                sx={{ cursor: "pointer" }}
              >
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {row?.type === "SELL" && col.key === "quantity" ? "-" : ""}
                    {row?.type==="SELL"&&col.key==="totalValue"?'-':''}
                    {col.format ? col.format(row[col.key]) : row[col.key]}
                  </TableCell>
                ))}

                <TableCell>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(e, row.symbol);
                    }}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GenericTable;
