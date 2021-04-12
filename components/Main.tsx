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
  INITIAL = "INITIAL",
  FINANCED = "FINANCED",
  DISBURSED = "DISBURSED",
  REPAID = "REPAID",
  DEFAULTED = "DEFAULTED",
  DISBURSAL_REQUESTED = "DISBURSAL_REQUESTED",
  ERROR_SENDING_REQUEST = "ERROR_SENDING_REQUEST",
}
export interface ReceiverInfo {
  receiverId: str
  receiverName: str
}

export interface Invoice {
  invoiceId: number;
  orderId: string;
  value: number;
  shippingStatus: ShipmentStatus;
  status: FinanceStatus;
  receiverInfo: ReceiverInfo
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
    const creditInfo =  useSWR<Invoice[]>("/v1/credit", fetcher, {
      refreshInterval: 10000,
    });
    // console.log('got creditinfo', Object.values(creditInfo.data))
  return {
    invoices: data,
    creditLineInfo: creditInfo.data,
    isError: error || creditInfo.error,
    isLoading: !error && !data && !creditInfo.error && !creditInfo.data
  }
};

const Main = () => {
  const { invoices, creditLineInfo, isLoading, isError } = getInvoices();
  // console.log(creditLineInfo)
  console.log('and in here', creditLineInfo)
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
        creditInfo={creditLineInfo}
        invoices={invoices}
        isLoading={isLoading}
        isError={isError}
      />
    </TabPanel>
    <TabPanel>
      <AccountInfo 
        invoices={invoices}
        // creditLines={[]}
        creditLines={creditLineInfo ? Object.values(creditLineInfo): []}
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
