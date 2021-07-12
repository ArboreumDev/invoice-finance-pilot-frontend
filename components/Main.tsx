import { Heading, Center, Spinner, VStack, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
import useSWR from "swr";
import LenderDashboard from "./LenderDashboard";
import WhitelistDashboard from "./WhitelistDashboard";
import AccountInfo from "./AccountInfo";
import AdminView from "./AdminView";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
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

export interface SupplierInfo {
  id: string
  name: string
  defaultTerms: Terms
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
  supplierId: string;
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
    const creditResult = useSWR<Invoice[]>("/v1/credit", fetcher, {
      refreshInterval: 10000,
    });
    const supplierResult = useSWR<Invoice[]>("/v1/supplier", fetcher, {
      refreshInterval: 10000,
    });
    
    const isError = error || creditResult.error || supplierResult.error
    const isLoading = !isError && (!data || !creditResult.data || !supplierResult.data)
    console.log('got ', creditResult.data, 'wile loading', isLoading)

  return {
    suppliers: supplierResult.data,
    invoices: data,
    creditInfo: creditResult.data,
    isError,
    isLoading
  }
};

const Main = () => {
  const { invoices, creditInfo, isLoading, isError, suppliers} = getInvoices();
  if (isLoading) {
    return <Heading as="h2" size="lg" fontWeight="400" color="gray.500">
        <Center>
          <Spinner />
        </Center>
      </Heading>
  }

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
        suppliers={suppliers}
        invoices={invoices}
        creditInfo={creditInfo}
        isLoading={isLoading}
        isError={isError}
      />
    </TabPanel>

    <TabPanel>
      <LenderDashboard
        creditInfo={creditInfo}
        invoices={invoices}
        isLoading={isLoading}
        isError={isError}
        suppliers={suppliers}
      />
    </TabPanel>

    <TabPanel>
       <WhitelistDashboard 
        creditInfo={creditInfo}
        suppliers={suppliers}
        isLoading={isLoading}
        isError={isError}
      /> 
    </TabPanel>

    <TabPanel>
      <AdminView 
        creditInfo={creditInfo}
        invoices={invoices}
        suppliers={suppliers}
      />

    </TabPanel>
  </TabPanels>
</Tabs>
    </VStack>
  );
};

export default Main;
