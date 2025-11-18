import { Box, CardMedia, Typography, useTheme } from "@mui/material";
import tradingStockImg from "../assets/images/trade.png";

export const Dashboard = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "95%",
        // marginTop: 10,
        marginLeft: "65px",
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <CardMedia
        component="img"
        image={tradingStockImg}
        alt="Trading Stock"
        sx={{
          width: "100%",
          height: "80vh",
          borderRadius: 3,
          // filter: "brightness(0.6)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "2%",
          width: "40%",
          color: "#fff",
          borderRadius: 2,
          p: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: "0.9rem",
            lineHeight: 1.7,
            textAlign: "justify",
          }}
        >
          This service provides comprehensive stock market information,
          combining company details and historical price data. Each stock
          includes key information such as its ticker symbol, full company name,
          trading currency, and the exchange where it is listed. Alongside this,
          it provides a series of historical prices with timestamps, including
          opening, closing, highest, and lowest prices for each trading period,
          as well as the traded volume. This structured data makes it possible
          to create professional financial visualizations, such as line charts,
          candlestick charts, or tables, showing trends and patterns over time.
          It also allows users to display lists of stocks with their names and
          symbols for easy browsing and selection.
        </Typography>
      </Box>
    </Box>
  );
};
