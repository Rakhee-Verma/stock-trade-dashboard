import {
  Container,
  FormLabel,
  TextField,
  Box,
  Button,
  useTheme,
  Typography,
} from "@mui/material";
import { useState } from "react";
import getLocalData from "../helper/getLocalData";

export const FundingAccount = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    accountNumber: "",
    IFSCCode: "",
    bankName: "",
    phoneNumber: "",
    amount: "",
  });
  const [errors, setErrors] = useState({
    nameError: "",
    accountNumberError: "",
    IFSCCodeError: "",
    bankNameError: "",
    phoneNumberError: "",
    amountError: "",
  });
  const validateField = (name, value) => {
    let error = "";
    if (!value.trim()) {
      error = "this field  is required";
    }
    if (name === "name" && value.length > 20) {
      error = "Max 20 characters allowed";
    }

    if (name === "accountNumber" && value.length > 12) {
      error = "Max 12 digits allowed";
    }
    if (name === "bankName" && value.length > 10) {
      error = "Max 10 character allowed";
    }
    if (name === "phoneNumber" && value.length > 10) {
      error = "Max 10 digits allowed";
    }

    if (name === "amount" && value.length > 5) {
      error = "Max 5 digits allowed";
    }
    setErrors((prev) => ({ ...prev, [`${name}Error`]: error }));

    return error === "";
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const inputStyle = {
    "& .MuiInputBase-root": {
      height: "45px",
    },
  };
  const handleSubmit = () => {
    let isValid = true;
    Object.keys(formData).forEach((field) => {
      const ok = validateField(field, formData[field]);
      if (!ok) isValid = false;
    });

    if (!isValid) return;
    getLocalData("set", "userDetails", formData);
    console.log("formdetails", formData);
    setFormData({
      name: "",
      accountNumber: "",
      IFSCCode: "",
      bankName: "",
      phoneNumber: "",
      walletBalance: "",
    });
  };
  const userDetail = getLocalData("get", "userDetails");
  return (
    <>
      <Typography
        sx={{ display: "flex", justifyContent: "center", fontSize: "1.3rem" }}
      >
        Available balance to purchase stock:$
        {Number(userDetail?.amount ?? 0).toFixed(2)}
      </Typography>
      <Container
        sx={{
          mt: 4,
          width: "50%",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          boxShadow: 2,
          py: 5,
          borderRadius: 2,
          boxShadow:
            theme.palette.mode === "dark"
              ? "2px 0 15px rgba(255, 255, 255, 0.3)"
              : "2px 0 15px rgba(0,0,0,0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 2,
            width: "100%",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Box flex={1}>
            <FormLabel>Name</FormLabel>
            <TextField
              placeholder="Enter Username"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              sx={inputStyle}
            />
            {errors.nameError && (
              <Typography sx={{ color: "red", fontSize: "0.8rem" }}>
                {errors.nameError}
              </Typography>
            )}
          </Box>

          <Box flex={1}>
            <FormLabel>Account Number</FormLabel>
            <TextField
              placeholder="Enter Account Number"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              fullWidth
              sx={inputStyle}
            />
            {errors.accountNumberError && (
              <Typography sx={{ color: "red", fontSize: "0.8rem" }}>
                {errors.accountNumberError}
              </Typography>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 2,
            width: "100%",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Box flex={1}>
            <FormLabel>IFSC Code</FormLabel>
            <TextField
              placeholder="Enter IFSC Code"
              name="IFSCCode"
              value={formData.IFSCCode}
              onChange={handleChange}
              fullWidth
              sx={inputStyle}
            />
            {errors.IFSCCodeError && (
              <Typography sx={{ color: "red", fontSize: "0.8rem" }}>
                {errors.IFSCCodeError}
              </Typography>
            )}
          </Box>

          <Box flex={1}>
            <FormLabel>Bank Name</FormLabel>
            <TextField
              placeholder="Enter Bank Name"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              fullWidth
              sx={inputStyle}
            />
            {errors.bankNameError && (
              <Typography sx={{ color: "red", fontSize: "0.8rem" }}>
                {errors.bankNameError}
              </Typography>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 2,
            width: "100%",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Box flex={1}>
            <FormLabel>Phone Number</FormLabel>
            <TextField
              placeholder="Enter Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              fullWidth
              sx={inputStyle}
            />
            {errors.phoneNumberError && (
              <Typography sx={{ color: "red", fontSize: "0.8rem" }}>
                {errors.phoneNumberError}
              </Typography>
            )}
          </Box>

          <Box flex={1}>
            <FormLabel>Amount</FormLabel>
            <TextField
              placeholder="Enter Amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              fullWidth
              sx={inputStyle}
            />
            {errors.amountError && (
              <Typography sx={{ color: "red", fontSize: "0.8rem" }}>
                {errors.amountError}
              </Typography>
            )}
          </Box>
        </Box>
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </Container>
    </>
  );
};
