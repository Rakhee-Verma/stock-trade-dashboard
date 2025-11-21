import { Container, FormLabel, TextField, Box, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import getLocalData from "../helper/getLocalData";

export const FundingAccount = () => {
    const navigate=useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    accountNumber: "",
    IFSCCode: "",
    bankName: "",
    phoneNumber: "",
    walletBalance: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const inputStyle = {
    "& .MuiInputBase-root": {
      height: "45px",
    },
  };
  const handleSubmit = () => {
    getLocalData("set", "userDetails", formData)
    console.log("formdetails", formData);
    setFormData({
      name: "",
      accountNumber: "",
      IFSCCode: "",
      bankName: "",
      phoneNumber: "",
      walletBalance: "",
    });
// navigate('/')
  };
  return (
    <Container
      sx={{
        mt:10,
        width: "50%",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        boxShadow: 2,
        py: 5,
        borderRadius: 2,
        
      }}
    >
      <Box display="flex" gap={2} mb={2} width="100%">
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
        </Box>
      </Box>
      <Box display="flex" gap={2} mb={2} width="100%">
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
        </Box>
      </Box>
      <Box display="flex" gap={2} mb={2} width="100%">
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
        </Box>

        <Box flex={1}>
          <FormLabel>Wallet Balance</FormLabel>
          <TextField
            placeholder="Enter Wallet Balance"
            name="walletBalance"
            value={formData.walletBalance}
            onChange={handleChange}
            fullWidth
            sx={inputStyle}
          />
        </Box>
      </Box>
      <Button variant="contained" onClick={handleSubmit}>
        Submit
      </Button>
    </Container>
  );
};
