import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StraightIcon from "@mui/icons-material/Straight";
import SouthIcon from "@mui/icons-material/South";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import GenericTable from "../components/common/GenericTable";
import { Box } from "@mui/material";

export const TradeInfoTable = () => {
  const [tradeDetails, setTradeDetails] = useState([]);
  // const [sorted, setSorted] = useState({ key: "", direction: "asc" });
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tradeInfo")||'[]');
       

    console.log(stored, "storedstored");

    const now = Date.now();
    const updated = stored?.map((t) => {
      if (t.status === "pending" && now - t.createdAt >= 10 * (1000*60)) {
        return { ...t, status: "completed" };
      }
      return t;
    });
    localStorage.setItem("tradeInfo", JSON.stringify(updated));
    setTradeDetails(updated);
  }, []);

  const navigate = useNavigate();
  console.log("tradeDetails:::", tradeDetails);

  const columns = [
    { key: "symbol", label: "Symbol" },
    {
      key: "lastUpdated",
      label: "Last Updated",
      format: (v) => new Date(v).toLocaleString(),
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      format: (v) => v.toFixed(2),
    },
    {
      key: "totalValue",
      label: "Total Value",
      sortable: true,
      format: (v) => v.toFixed(2),
    },
    { key: "quantity", label: "Quantity", sortable: true },
  ];
  const pendingTrades = tradeDetails?.filter((t) => t.status === "pending");
  const completedTrades = tradeDetails?.filter((t) => t.status === "completed");

  console.log(pendingTrades, "pendingTrades");
  console.log(completedTrades, "completedTrades");

  return (
    <>
    <Box sx={{pb:4}}>
      <GenericTable
        title="Pending"
        columns={columns}
        rows={pendingTrades}
        onRowClick={(row) => navigate(`/charts/${row.symbol}`)}
        // onRemove={handleRemoveButton}
      />
      </Box>
      <GenericTable
        title="Completed"
        columns={columns}
        rows={completedTrades}
        onRowClick={(row) => navigate(`/charts/${row.symbol}`)}
        // onRemove={handleRemoveButton}
      />
 
    </>
    
  );
};
