import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Pagination,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStocks } from "../redux/stockSlice";
import { useDispatch, useSelector } from "react-redux";
import stockImg from "../assets/images/stock.png";
export const StockCards = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { filterProduct, loading, error } = useSelector((state) => state.stock);
  console.log(filterProduct, "filterProduct:::");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchStocks());
  }, [dispatch]);
 const perPageStock = 50;
  const displayStock = filterProduct.slice(
    (page - 1) * perPageStock,
    page * perPageStock
  );
  const totalPage = Math.ceil(filterProduct.length / perPageStock);
  const handlePagination = (event, value) => {
    setPage(value);
  };

  if (loading) {
     return (
       <Box textAlign="center">
         <CircularProgress />
       </Box>
     );
   }
  if (error) return <Typography color="error">{error}</Typography>;

  const handleSelectedStock = (symbol) => {
    navigate(`/charts/${symbol}`);
  };
  return (
    <>
    <Box sx={{marginLeft:{xs:"35px"}}}><Pagination
        count={totalPage}
        color="primary"
        sx={{ display: "flex", justifyContent: "center" }}
        onChange={handlePagination}
        page={page}
        
      /></Box>
      

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1,1fr)",
            sm: "repeat(2,1fr)",
            md: "repeat(3,1fr)",
            lg: "repeat(4,1fr)",
          },
          flex: 1,
          padding: "20px",
          overflowY: "auto",
          // marginTop: "64px",
          marginLeft: "50px",
          boxSizing: "border-box",
          gap: 2,
        }}
      >
        {displayStock.map((stock) => (
          <Card
            key={stock.symbol}
            sx={{
              width: {lg:"240px",xs:"180px"},
              height: "auto",
              borderRadius: "16px",
              background:
                "linear-gradient(135deg, #894dc8ff 0%, #76a3f1ff 100%)",
              color: "white",
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
              p: 2,
           
            }}
          >
            <Typography variant="h6" fontWeight="bold"  >
              {stock?.symbol || symbol}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="subtitle2"sx={{fontSize:{xs:"0.8rem"}}}>{stock?.figi_code}</Typography>
                <Typography variant="subtitle2" sx={{fontSize:{xs:"0.8rem"}}}>
                  {stock.name.length > 15
                    ? `${stock.name.slice(0, 15)}`
                    : stock.name}
                </Typography>
              </Box>
              {/* <Typography variant="subtitle2">
                Currency: {stock?.currency}
              </Typography> */}
              <CardMedia
                component="img"
                image={stockImg}
                alt="Trading Stock"
                sx={{
                  width: {lg:"50px",xs:"35px"},
                  height:{ lg:"40px",xs:"30px"},
                  filter: "brightness(0) invert(1)",
                }}
              />
            </Box>

            <Button
              variant="contained"
              size="small"
              onClick={() => handleSelectedStock(stock.symbol)}
              sx={{
                background:
                  "linear-gradient(135deg, #ffffff33 0%, #ffffff55 100%)",
                color: "#fff",
                width: "80px",
                mt: 2,
               fontSize:{xs:"0.8rem"}
              }}
            >
              View
            </Button>
            {/* </CardActions> */}
          </Card>
        ))}
      </Box>
    </>
  );
};
