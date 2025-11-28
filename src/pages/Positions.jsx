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
import getLocalData from "../helper/getLocalData";
export const Positions = ({
  onTrade,
  latestPrice,
  quantity,
  setQuantity,
  setOpen,
  availableQty,
  trades,
}) => {
  const theme = useTheme();
  const [totalValue, setTotalValue] = useState(0);
  useEffect(() => {
    const price = latestPrice?.price || 0;
    const qty = parseFloat(quantity) || 0;
    setTotalValue(price * qty);
  }, [quantity, latestPrice]);
  const handleBuyButton = () => {
    if (!quantity) return;
    onTrade(quantity, "BUY");
    setOpen(true);
  };
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
  const userDetail = getLocalData("get", "userDetails");
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
        <Typography>Available balance: ${Number(userDetail?.amount ?? 0).toFixed(2)}</Typography>
        <Typography>Total Value: ${totalValue.toFixed(2)}</Typography>
        <Typography sx={{ fontSize: "0.8rem" }}>
          Available to shell:{availableQty}
        </Typography>

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
      <Box>
        {trades?.length > 0 ? (
           [...trades]?.reverse().map((trade, index) => (
            <Box
              key={index}
              sx={{
                width: "300px",
                p: 2,
                borderRadius: 2,
                backgroundColor:
                  trade.type === "SELL" ? "#fc4235ff" : "#00e676",
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "2px 0 15px rgba(255, 255, 255, 0.3)"
                    : "2px 0 15px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                my: 1,
              }}
            >
              <Typography>{trade.symbol} stock price</Typography>
              <Typography>
                Quantity:
                {`${trade?.type === "SELL" ? "-" : ""}${
                  trade?.quantity || 0.0
                }`}
              </Typography>
              <Typography>
                Total Price:$
                {`${
                  trade?.type === "SELL" ? "-" : ""
                }${trade?.totalValue?.toFixed(2)}`}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography>No stock purchased or sold</Typography>
        )}
      </Box>
    </>
  );
};
