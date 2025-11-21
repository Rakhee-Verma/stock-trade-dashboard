import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
  useTheme,
  Popper,
  Fade,
  Modal,
  Backdrop,
  Pagination,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Chart from "react-apexcharts";
import { Positions } from "./Positions";
import getLocalData, { getTimeFrame } from "../helper/getLocalData";

export const Charts = () => {
  const theme = useTheme();
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [timeFrame, setTimeFrame] = useState("1M");
  const [filteredData, setFilteredData] = useState([]);
  const [latestPrice, setLatestPrice] = useState(null);
  const [tradeInfo, setTradeInfo] = useState(null);
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [availableQty, setAvailableQty] = useState(0);
  const [trades, setTrades] = useState([]);
  const [totalPrice, setTotalPrice] = useState(null);
  const fetchChart = async ({ queryKey }) => {
    const [, symbol, timeFrame] = queryKey;

    const { interval, outputsize } = getTimeFrame(timeFrame);

    const api = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=4f61a92dc43f4841b0c2f0a4599f01fa`;

    const response = await axios.get(api);
    console.log(response, "response:::>>");
    const formatted = response.data.values
      .map((item) => ({
        x: new Date(item.datetime),
        y: parseFloat(item.close),
      }))
      .reverse();

    return formatted;
  };

  // ✅ Use React Query to fetch data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["chart", symbol, timeFrame],
    queryFn: fetchChart,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (data) {
      setFilteredData(data);
      setLatestPrice({
        price: data[data.length - 1].y,
        time: data[data.length - 1].x,
      });
    }
  }, [data]);
  useEffect(() => {
    const savedTrade = getLocalData("get", "tradeInfo");
    const matched = savedTrade?.filter((t) => t.symbol === symbol);
    const totalBuy = matched
      .filter((t) => t.type === "BUY")
      .reduce((sum, item) => sum + Number(item.quantity), 0);

    const totalSell = matched
      .filter((t) => t.type === "SELL")
      .reduce((sum, item) => sum + Number(item.quantity), 0);
    const totalQty = totalBuy - totalSell;
    setAvailableQty(totalQty);
    setTrades(matched);
  }, [symbol, open]);

  const handleBuyTrade = (quantity, type) => {
    if (!latestPrice || !quantity) return;
    const qty = Number(quantity);
    const totalValue = latestPrice.price * qty;
    setTotalPrice(totalValue);
    if (type === "SELL" && qty > availableQty) {
      setTradeInfo({
        error: "Sell quantity exceeds available stock.",
      });
      setOpen(true);
      return;
    }
    const userDetails = getLocalData("get", "userDetails");
    const walletBalance = userDetails?.walletBalance;
    if (walletBalance < totalValue) {
      setTradeInfo({
        lowBalance: true,
        msg: "You don’t have enough balance to buy this stock. Please add money to your wallet.",
      });
      setOpen(true);

      return;
    }
    setTradeInfo({
      symbol,
      quantity: qty,
      price: latestPrice.price,
      totalValue,
      lastUpdated: latestPrice.time,
      status: "pending",
      createdAt: Date.now(),
      type,
    });

    setOpen(true);
  };

  const handleCloseButton = () => {
    setOpen(!open);
  };

  const handleConfirmButton = () => {
    if (tradeInfo) {
      const existingTrades = getLocalData("get", "tradeInfo");
      const userDetails = getLocalData("get", "userDetails");
      const totalBal = userDetails.walletBalance;
      userDetails.walletBalance = totalBal - totalPrice;
      getLocalData("set", "userDetails", userDetails);

      if (existingTrades && Array.isArray(existingTrades)) {
        const updatedTrades = [...existingTrades, tradeInfo];
        getLocalData("set", "tradeInfo", updatedTrades);
      } else {
        getLocalData("set", "tradeInfo", tradeInfo);
      }
    }
    setQuantity("");
    setOpen(false);
    console.log(tradeInfo, "tradeInfo");
  };

  // 📊 ApexChart Configuration
  const options = useMemo(() => {
    return {
      chart: {
        type: "line",
        zoom: { enabled: true },
        toolbar: { show: true },
        foreColor: theme.palette.text.primary, // Dynamic text color
      },
      title: {
        text: `${symbol} Stock Price`,
        align: "left",
        style: { color: theme.palette.text.primary },
      },
      xaxis: {
        type: "datetime",
        labels: {
          datetimeUTC: false,
          style: { colors: theme.palette.text.primary },
        },
      },
      yaxis: {
        tooltip: { enabled: true },
        labels: {
          formatter: (val) => `$${val.toFixed(2)}`,
          style: { colors: theme.palette.text.primary },
        },
      },
      stroke: {
        curve: "smooth",
        width: 2,
        colors: ["#1976d2"],
      },
      tooltip: {
        theme: theme.palette.mode,
        x: { format: "dd MMM yyyy HH:mm" },
      },
    };
  }, [theme, symbol]);

  const series = useMemo(
    () => [
      {
        name: "Close Price",
        data: filteredData,
      },
    ],
    [filteredData]
  );
  console.log("filteredData::::", filteredData);
  const handleAddMoneyButton = () => {
    navigate("/fundingAccount");
  };
  if (isLoading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error" textAlign="center">
        Failed to load chart data.
      </Typography>
    );
  }
  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: { lg: "flex", sm: "block" },
          justifyContent: "space-evenly",
        }}
      >
        <Box
          sx={{
            width: { lg: "60%", sm: "75%" },
            marginLeft: { lg: "0px", sm: "100px", xs: "120px" },
            p: 2,
            borderRadius: 1,
            boxShadow:
              theme.palette.mode === "dark"
                ? "2px 0 15px rgba(255, 255, 255, 0.3)"
                : "2px 0 15px rgba(0,0,0,0.1)",
            height: { lg: "80vh", md: "95vh" },
          }}
        >
          <Typography variant="h5" gutterBottom>
            {symbol} Stock Price
          </Typography>
          <Chart options={options} series={series} type="line" height={350} />
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            {["1D", "1W", "1M", "3M"].map((tf) => (
              <Button
                key={tf}
                variant={tf === timeFrame ? "contained" : "outlined"}
                size="small"
                onClick={() => setTimeFrame(tf)}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "8px",
                }}
              >
                {tf}
              </Button>
            ))}
          </Box>
        </Box>
        <Box
          sx={{
            width: "20%",
            marginLeft: { sm: "150px", lg: 0, xs: "120px" },
            marginTop: { md: "10px", sm: "20px", xs: "30px" },
          }}
        >
          <Positions
            latestPrice={latestPrice}
            quantity={quantity}
            onTrade={handleBuyTrade}
            setQuantity={setQuantity}
            setOpen={setOpen}
            availableQty={availableQty}
            trades={trades}
            // TotalBalance={balance}
          />
        </Box>
      </Box>

      <Modal
        open={open}
        onClose={handleCloseButton}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: "absolute",
              top: { lg: "50%", md: "50%", sm: "50%", xs: "50%" },
              left: { lg: "50%", md: "50%", sm: "50%", xs: "50%" },
              transform: {
                lg: "translate(-50%, -50%)",
                md: "translate(-50%, -50%)",
                sm: "translate(-50%, -50%)",
                xs: "translate(-50%, -50%)",
              },
              width: 350,
              bgcolor: "background.paper",
              borderRadius: 2,
              p: 3,
              boxShadow:
                theme.palette.mode === "dark"
                  ? "2px 0 15px rgba(255, 255, 255, 0.3)"
                  : "2px 0 15px rgba(0,0,0,0.1)",
            }}
          >
            {tradeInfo?.lowBalance ? (
              <>
                <Typography>{tradeInfo.msg}</Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    varient="outlined"
                    size="small"
                    onClick={handleCloseButton}
                  >
                    Close
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleAddMoneyButton}
                  >
                    Add Money
                  </Button>
                </Box>
              </>
            ) : tradeInfo?.error ? (
              <Typography color="error">{tradeInfo.error}</Typography>
            ) : (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {symbol} Stock Price
                </Typography>

                <Typography sx={{ fontSize: "0.9rem", mb: 1 }}>
                  Latest Price: ${latestPrice?.price?.toFixed(2) || 0.0}
                </Typography>

                <Typography sx={{ fontSize: "0.9rem", mb: 1 }}>
                  Last Updated:{" "}
                  {latestPrice?.time
                    ? new Date(latestPrice.time).toLocaleString()
                    : "--"}
                </Typography>

                <Typography sx={{ fontSize: "0.9rem", mb: 1 }}>
                  Total Price: ${" "}
                  {`${tradeInfo?.type === "SELL" ? "-" : ""}${
                    tradeInfo?.totalValue?.toFixed(2) || 0.0
                  }`}
                </Typography>
                <Typography sx={{ fontSize: "0.9rem", mb: 2 }}>
                  Quantity: ${" "}
                  {`${tradeInfo?.type === "SELL" ? "-" : ""}${
                    tradeInfo?.quantity || 0.0
                  }`}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleCloseButton}
                  >
                    Close
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleConfirmButton}
                  >
                    Confirm
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>
    </>
  );
};
