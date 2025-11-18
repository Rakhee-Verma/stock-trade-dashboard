import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useParams } from "react-router-dom";

export const Positions = ({
  onTrade,
  latestPrice,
  quantity,
  setQuantity,
  setOpen,
}) => {
  const theme = useTheme();
  const [totalValue, setTotalValue] = useState(0);
  // const [savedTrades, setSavedTrades] = useState([]);
  const [trades, setTrades] = useState([]);
  const { symbol } = useParams();
  useEffect(() => {
    const price = latestPrice?.price || 0;
    const qty = parseFloat(quantity) || 0;
    setTotalValue(price * qty);
  }, [quantity, latestPrice]);
  useEffect(() => {
    const savedTrade = JSON.parse(localStorage.getItem("tradeInfo")) ?? [];
    const matched = savedTrade.filter((t) => t.symbol === symbol);
    setTrades(matched);
  }, [symbol]);

  const handleBuyButton = () => {
    if (!quantity) return;
    onTrade(quantity, "BUY");
    console.log(quantity, "quantity:::::");

    setOpen(true);
  };
  console.log("trades:::>>>", trades);

  const handleSellButton = () => {
    if (!quantity) return;
    onTrade(quantity, "SELL");
    setOpen(true);
  };

  const handleSearchChange = (e) => {
    let val = e.target.value;

    // Allow only numbers and max 2 digits after decimal
    if (/^\d*\.?\d{0,2}$/.test(val)) {
      setQuantity(val);
    }
  };

  return (
    <>
      <Box
        sx={{
          width: "300px",
          p: 2,
          borderRadius: 2,
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.background.paper
              : "#fff",
          boxShadow:
            theme.palette.mode === "dark"
              ? "2px 0 15px rgba(255, 255, 255, 0.3)"
              : "2px 0 15px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="subtitle1" sx={{ my: 1 }}>
          Current Price: ${latestPrice?.price?.toFixed(2) || "--"}
        </Typography>

        <TextField
          placeholder="Enter Quantity"
          size="small"
          type="number"
          value={quantity}
          onChange={handleSearchChange}
          sx={{ mb: 2 }}
        />

        <Typography>Total Value: ${totalValue.toFixed(2)}</Typography>

        <Stack
          direction="row"
          spacing={10}
          sx={{ display: "flex", justifyContent: "space-around" }}
        >
          <Button variant="contained" color="success" onClick={handleBuyButton}>
            Buy
          </Button>
          <Button variant="contained" color="error" onClick={handleSellButton}>
            Sell
          </Button>
        </Stack>
      </Box>
      <Box
        sx={{
          width: "300px",
          p: 2,
          borderRadius: 2,
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.background.paper
              : "#fff",
          boxShadow:
            theme.palette.mode === "dark"
              ? "2px 0 15px rgba(255, 255, 255, 0.3)"
              : "2px 0 15px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          my: 4,
        }}
      >
        {trades?.length > 0 ? (
          trades.map((trade, index) => (
            <Box key={index} sx={{ width: "100%", mb: 2 }}>
              <Typography>{trade.symbol} stock price</Typography>
              <Typography>Quantity:{trade.quantity}</Typography>
              <Typography>Total Price:{trade.totalValue}</Typography>
            </Box>
          ))
        ) : (
          <Typography>No stock purchased or sold</Typography>
        )}
      </Box>
    </>
  );
};
