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
import { useParams } from "react-router-dom";
import Chart from "react-apexcharts";
import { Positions } from "./Positions";

export const Charts = () => {
  const theme = useTheme();
  const { symbol } = useParams();
  const [timeFrame, setTimeFrame] = useState("1M");
  const [filteredData, setFilteredData] = useState([]);
  const [latestPrice, setLatestPrice] = useState(null);
  const [tradeInfo, setTradeInfo] = useState(null);
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState("");
  const fetchChart = async ({ queryKey }) => {
    const [, symbol, timeFrame] = queryKey;

    // Adjust interval and outputsize by timeframe
    let interval = "5min";
    let outputsize = 30;

    switch (timeFrame) {
      case "1D":
        interval = "5min";
        outputsize = 80; // About 1 day
        break;
      case "1W":
        interval = "1h";
        outputsize = 120; // About 1 week
        break;
      case "1M":
        interval = "1day";
        outputsize = 30;
        break;
      case "3M":
        interval = "1week";
        outputsize = 12;
        break;
      default:
        interval = "1day";
        outputsize = 30;
    }

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
  console.log(latestPrice, "latestPrice>>>");

  const handleBuyTrade = (quantity, type) => {
    if (!latestPrice || !quantity) return;
    const qty = Number(quantity);
    const finalQty = type === "SELL" ? -Math.abs(qty) : Math.abs(qty);
    const totalValue = latestPrice.price * finalQty;

    setTradeInfo({
      symbol,
      quantity: finalQty,
      price: latestPrice.price,
      totalValue,
      lastUpdated: latestPrice.time,
      status: "pending",
      createdAt: Date.now(),
    });

    setOpen(true);
  };

  const handleCloseButton = () => {
    setOpen(!open);
  };

  const handleConfirmButton = () => {
    if (tradeInfo) {
      const existingTrades =
        JSON.parse(localStorage.getItem("tradeInfo")) || [];

      if (existingTrades && Array.isArray(existingTrades)) {
        const updatedTrades = [...existingTrades, tradeInfo];
        localStorage.setItem("tradeInfo", JSON.stringify(updatedTrades));
      } else {
        localStorage.setItem("tradeInfo", JSON.stringify([tradeInfo]));
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
              top: {lg:"50%"},
              left: {lg:"50%"},
              transform: "translate(-50%, -50%)",
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
              Total Price: ${tradeInfo?.totalValue?.toFixed(2) || 0.0}
            </Typography>
            <Typography sx={{ fontSize: "0.9rem", mb: 2 }}>
              Quantity: ${tradeInfo?.quantity || 0.0}
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
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
        </Fade>
      </Modal>
    </>
  );
};
