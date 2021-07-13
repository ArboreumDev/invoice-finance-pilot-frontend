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
import {FinanceStatus, SupplierInfo} from "./Main"
import {CreditLineInfo} from "./AccountInfo"
import {InvoiceDetails} from "./InvoiceDetails"
import InvoiceTable from "./InvoiceTable"
import { Currency } from "./common/Currency";


interface Props {
  invoices: Invoice[],
  isLoading: boolean,
  isError: Object
  creditInfo: any
  suppliers: SupplierInfo[]

}

const LenderDashboard = ({invoices, isLoading, isError, creditInfo, suppliers}: Props) => {
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
  console.log('in dashboard', creditInfo)

  const [receiverId, setReceiver] = useState("")
  const [supplierId, setSupplier] = useState("")
  const [invoiceStatus, setInvoiceStatus] = useState("")
  // const [invoicesToShow, setInvoicesToShow] = useState(invoices)

  const filteredInvoices = () => {
      return invoices 
      .filter( i => supplierId ? i.supplierId === supplierId : true)
      .filter( i => receiverId ? i.receiverInfo.id === receiverId : true)
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

  const filteredReceiversCreditInfo = () => {
    if (supplierId) {
      return Object.values(creditInfo[supplierId])
    } 
    else {
      let ret = []
      for (const supplier in creditInfo) {
        console.log('supplierloop', supplier)
        if (supplier !== "tusker") {
          ret = ret.concat(Object.values(creditInfo[supplier]))
        }
      }
      console.log('ret', ret)
      return ret
    }
  }

  return (
    <>
    <VStack>
    <HStack >
      <Text minW="110px" width="27%">Show Invoices:</Text>
      <Select onChange={(e)=> setInvoiceStatus(e.target.value)} placeholder="All Status">
        <option value={FinanceStatus.INITIAL}>requested & awaiting delivery (INITIAL)</option>
        <option value={FinanceStatus.DISBURSAL_REQUESTED}>delivered & awaiting disbursal (DISBURSAL_REQUESTED)</option>
        <option value={FinanceStatus.FINANCED}>disbursed & to be paid back (FINANCED)</option>
      </Select>
      {suppliers && (
        <Select onChange={(e)=> setSupplier(e.target.value)} placeholder="All Suppliers">
          {suppliers.map((s) => (
            // eslint-disable-next-line react/jsx-key
            <option value={s.id}> {s.name} </option>
            ))}
        </Select>
        )}

      {creditInfo && (
        <Select onChange={(e)=> setReceiver(e.target.value)} placeholder="All Receivers">
          { 
          filteredReceiversCreditInfo().map((c) => (
            // eslint-disable-next-line react/jsx-key
            <option value={c.info.id}> {c.info.name} ({c.info.city}) </option>
            ))}
        </Select>
        )}
        <Box minW="170px" width="10%">
          <AddInvoiceDrawer />
        </Box>
      </HStack>
      <Divider />
      <HStack width="100%">
        <Center width="100%">
          <Box minW="xl" width="100%">
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
