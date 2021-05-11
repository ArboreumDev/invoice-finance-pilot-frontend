import {Select,Spacer, Flex, Box, Button, Center, Divider, Grid, Heading, HStack, Text, VStack} from "@chakra-ui/react"
import {Line} from 'react-chartjs-2';
import useSWR from 'swr'
import AmountInput from "./AmountInput"
import AddInvoiceDrawer from "./AddInvoiceDrawer"
import {Invoice} from "./Main"
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axiosInstance, {fetcher} from "../utils/fetcher"
import { useForm } from "react-hook-form"
import {FinanceStatus} from "./Main"
import {CreditLineInfo} from "./AccountInfo"
import {InvoiceDetails} from "./InvoiceDetails"
import InvoiceTable from "./InvoiceTable"
import { Currency } from "./common/Currency";


interface Props {
  invoices: Invoice[],
  isLoading: boolean,
  isError: Object
  creditInfo: any

}

const LenderDashboard = ({invoices, isLoading, isError, creditInfo}: Props) => {
  if (isLoading) {
    return <Heading as="h2" size="lg" fontWeight="400" color="gray.500">
        Loading
      </Heading>
  }
  if (isError) {
    console.log(isError)
    return <Heading as="h2" size="lg" fontWeight="400" color="gray.500">
        There was an error
      </Heading>
  }

  const [receiverId, setReceiver] = useState("")
  const [invoiceStatus, setInvoiceStatus] = useState("")
  // const [invoicesToShow, setInvoicesToShow] = useState(invoices)

  const filteredInvoices = () => {
      return invoices .filter( i => receiverId ? i.receiverInfo.id === receiverId : true)
        .filter(i => invoiceStatus ? i.status === invoiceStatus : true)

    } 

  const onInvest = () => {
    // invest in loan
    console.log("invested")
  }  

  const showDetails = (invoiceId) => {
    const inv = invoices.filter(i => i.invoiceId === invoiceId)
    const msg = "TODO format this: " + JSON.stringify(inv)
    alert(msg)
  }
  
  const chart_options = {
    maintainAspectRatio: false
  }

  return (
    <>
    <VStack>
    <HStack width="100%">
      <Text width="20%">Show Invoices:</Text>
      <Select onChange={(e)=> setInvoiceStatus(e.target.value)} placeholder="All Status">
        <option value={FinanceStatus.INITIAL}>requested & awaiting delivery (INITIAL)</option>
        <option value={FinanceStatus.DISBURSAL_REQUESTED}>delivered & awaiting disbursal (DISBURSAL_REQUESTED)</option>
        <option value={FinanceStatus.FINANCED}>disbursed & to be paid back (FINANCED)</option>
      </Select>
      {creditInfo && (
        <Select onChange={(e)=> setReceiver(e.target.value)} placeholder="All Receivers">
          {Object.keys(creditInfo).map((c) => (
            <option value={c}> {creditInfo[c].info.name} ({creditInfo[c].info.city}) </option>
          ))}
        </Select>
        )}
      </HStack>
        <AddInvoiceDrawer />
      <Divider />
      <HStack width="100%">
        <Center width="100%" minW="xl">
          <Box minW="xl">
          <InvoiceTable invoices={
            filteredInvoices().sort((a,b) => {return parseInt(b.orderId) - parseInt(a.orderId);})
          } />
        </Box>
        </Center>
      </HStack>
    </VStack>
    </>
  )
}

export default LenderDashboard
