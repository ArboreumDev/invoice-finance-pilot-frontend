import { VStack, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
import useSWR from "swr";
import LenderDashboard from "./LenderDashboard";
import WhitelistDashboard from "./WhitelistDashboard";
import AccountInfo from "./AccountInfo";
import AdminView from "./AdminView";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import {fetcher} from "../utils/fetcher"


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

export interface Terms {
  apr: number
  tenorInDays: number
  creditlineSize: number
}
export interface ReceiverInfo {
  id: string
  name: string
  phone: string
  city: string
  terms: Terms
}

export interface PaymentDetails {
  requestId: string
  repaymentId: string
  interest: number
  collectionDate: any
  startDate: any
}

export interface Invoice {
  invoiceId: string;
  orderId: string;
  value: number;
  shippingStatus: ShipmentStatus;
  status: FinanceStatus;
  receiverInfo: ReceiverInfo
  paymentDetails: any
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
  return (
    <VStack align="left" textAlign="left" p="20px">

<Tabs isFitted variant="enclosed">
  <TabList>
    <Tab>Account</Tab>
    <Tab>Invoices</Tab>
    <Tab>Whitelist</Tab>
    <Tab>AdminView</Tab>
  </TabList>

  <TabPanels >
    <TabPanel>
      <AccountInfo 
        invoices={invoices}
        creditLines={creditLineInfo ? Object.values(creditLineInfo): []}
        isLoading={isLoading}
        isError={isError}
      />
    </TabPanel>

    <TabPanel>
      <LenderDashboard
        creditInfo={creditLineInfo}
        invoices={invoices}
        isLoading={isLoading}
        isError={isError}
      />
    </TabPanel>

    <TabPanel>
      <WhitelistDashboard 
        creditInfo={creditLineInfo ? Object.values(creditLineInfo): []}
        isLoading={isLoading}
        isError={isError}
      />
    </TabPanel>

    <TabPanel>
      <AdminView 
        creditInfo={creditLineInfo}
        invoices={invoices}
      />

    </TabPanel>
  </TabPanels>
</Tabs>
    </VStack>
  );
};

export default Main;
