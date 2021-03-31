import { VStack, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
import useSWR from "swr";
import axios from "axios";
import LenderDashboard from "./LenderDashboard";
import AccountInfo from "./AccountInfo";
import BorrowerDashboard from "./BorrowerDashboard";
import AdminDashboard from "./AdminDashboard";
// import React from "react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { resolveTxt } from "dns";
import axiosInstance, {fetcher} from "../utils/fetcher"

// for rc-admin role
const SUPER_AUTH_TOKEN = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyYyIsImV4cCI6MjA0Njk2MzQ1Niwicm9sZSI6InJjX2FkbWluIn0.GV0Q2mPmMUT4In6ro8QL_LO-nsXqUIV6NUlg46Q2_eg"


// const axiosInstance = axios.create({
//   baseURL: "http://localhost:8000/",
//   // headers: { Authorization: SUPER_AUTH_TOKEN },
// });

// axiosInstance.interceptors.request.use(function (config) {
//   const token = localStorage.getItem('arboreum:info');
//   config.headers.Authorization =  token ? `Bearer ${token}` : '';
//   return config;
// });

// export const axiosInstance;


export enum ShipmentStatus {
  DEFAULTED = "DEFAULTED",
  AWAITING_SHIPMENT = "AWAITING_SHIPMENT",
  SHIPPING = "SHIPPING",
  DELIVERED = "DELIVERED",
}

export enum FinanceStatus {
  NONE = "NONE",
  FINANCED = "FINANCED",
  REPAID = "REPAID",
  DEFAULTED = "DEFAULTED",
}

export interface Invoice {
  invoiceId: number;
  orderId: string;
  value: number;
  shippingStatus: ShipmentStatus;
  status: FinanceStatus;
  // endDate: Date
}


const getInvoices = () => {
  const router = useRouter();
  useEffect(function mount() {
    const r = JSON.parse(window.localStorage.getItem("arboreum:info"))
    if (!r) {
      console.log("couldnt find user info!")
      router.push("/login");
    }
  })
    const { data, error } = useSWR<Invoice[]>("/v1/invoice", fetcher, {
      refreshInterval: 10000,
    });
  return {
    invoices: data,
    isError: error,
    isLoading: !error && !data
  }
};

const Main = () => {
  const { invoices, isLoading, isError } = getInvoices();
  return (
    <VStack align="left" textAlign="left" p="20px">

<Tabs isFitted variant="enclosed">
  <TabList>
    <Tab>Invoices Dashboard</Tab>
    <Tab>Account</Tab>
  </TabList>

  <TabPanels >
    <TabPanel>
      <LenderDashboard
        invoices={invoices}
        isLoading={isLoading}
        isError={isError}
      />
    </TabPanel>
    <TabPanel>
      <AccountInfo 
        invoices={invoices}
        isLoading={isLoading}
        isError={isError}
      />
    </TabPanel>
  </TabPanels>
</Tabs>
    </VStack>
  );
};

export default Main;
