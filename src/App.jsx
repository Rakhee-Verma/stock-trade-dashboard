import "./App.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { StockCards } from "./pages/StockCards";
import { Charts } from "./pages/Charts";
import { TradeInfoTable } from "./pages/TradeInfoTable";
import MaintenancePage from "./pages/MaintenancePage "
import { Dashboard } from "./pages/Deshboard";
import { FundingAccount } from "./pages/FundingAccount";


function App({ toggleTheme, mode }) {
  return (
    <Layout toggleTheme={toggleTheme} mode={mode}>
      <Routes>
        <Route path="/stockCards" element={<StockCards />} />
        <Route path="/charts/:symbol" element={<Charts />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/tradeInfoTable" element={<TradeInfoTable />} />
        <Route path="/fundingAccount" element={<FundingAccount />} />
        <Route path="*" element={<MaintenancePage />} />
      </Routes>
    </Layout>
  );
}

export default App;
