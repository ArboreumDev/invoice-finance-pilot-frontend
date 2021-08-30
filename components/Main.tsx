import { Text, Heading, Center, Spinner, VStack, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
import useSWR from "swr";
import LenderDashboard from "./LenderDashboard";
import WhitelistDashboard from "./whitelist/WhitelistDashboard";
import AccountInfo from "./AccountInfo";
import AdminView from "./AdminView";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {fetcher} from "../utils/fetcher"
import {CreditLineInfo, CreditSummary} from "./CreditlinesTable";
import SupplierDashboard from "./supplier/SupplierDashboard";
import axiosInstance from "../utils/fetcher"
import { error } from "./common/popups";

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

// TODO: We are using this type for default terms but we do not have a default creditline
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
  creditlineSize: number
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
  useEffect(() => {
    const r = JSON.parse(window.localStorage.getItem("arboreum:info"))
    if (!r) {
      console.log("couldnt find user info!")
      router.push("/login");
    } else {
      // verify token by making a simple request
      axiosInstance.get("/v1/credit")
      .then(() => {
        router.push("/")
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          window.localStorage.removeItem("arboreum:info")
          console.log("invalid token -> login again")
          router.push("/login");
        }
      })
    }
  },[])

  const { data, error } = useSWR<Invoice[]>("/v1/invoice", fetcher, {
      refreshInterval: 10000,
    });
  const creditResult = useSWR<CreditSummary>("/v1/credit", fetcher, {
    refreshInterval: 10000,
  });
  const supplierResult = useSWR<SupplierInfo[]>("/v1/supplier", fetcher, {
    refreshInterval: 10000,
  });

  const isError = error || creditResult.error || supplierResult.error
  const isLoading = !isError && (!data || !creditResult.data || !supplierResult.data)
  const errorData = error?.response || creditResult.error?.response || supplierResult.error?.response


  return {
    suppliers: supplierResult.data,
    invoices: data,
    creditInfo: creditResult.data,
    isError,
    error: isError ? errorData : {},
    isLoading
  }
};

const Main = () => {
  const { invoices, creditInfo, suppliers, isLoading, isError, error } = getInvoices();
  if (isError) console.log('err2', error)
  if (isLoading) {
    return <Heading as="h2" size="lg" fontWeight="400" color="gray.500">
        <Center>
          <Spinner />
        </Center>
      </Heading>
  }
  if (isError) {
    return <Heading as="h2" size="lg" fontWeight="400" color="gray.500">
        <Center>
          <Text> Error: {error ? error.statusText : "Unknown"} </Text> 
        </Center>
      </Heading>
  }

  return (
    <VStack align="left" textAlign="left" p="20px">

  <Tabs isFitted variant="enclosed">
  <TabList>
    <Tab>Account</Tab>
    <Tab>Invoices</Tab>
    <Tab>Suppliers</Tab>
    <Tab>Whitelist</Tab>
    <Tab>AdminView</Tab>
  </TabList>

  <TabPanels >
    <TabPanel>
      <AccountInfo 
        suppliers={suppliers}
        invoices={invoices}
        creditInfo={creditInfo}
      />
    </TabPanel>

    <TabPanel>
      <LenderDashboard
        creditInfo={creditInfo}
        invoices={invoices}
        suppliers={suppliers}
      />
    </TabPanel>

    <TabPanel>
       <SupplierDashboard
        suppliers={suppliers}
      />
    </TabPanel>

    <TabPanel>
       <WhitelistDashboard 
        creditInfo={creditInfo}
        suppliers={suppliers}
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
