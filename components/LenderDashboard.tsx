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
      return invoices .filter( i => receiverId ? i.receiverInfo.receiverId === receiverId : true)
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
//   const creditorInfo = {
//   "216c6829-6439-4fcb-b7dc-d35d337e9315": {
//     name: "gurugrupa test receiver 1",
//     available: 40000,
//     used: 0,
//     total: 50000,
//     requested: 10000
//   },
//   "1aee8ce8-9c4c-4b7c-a790-6d8b4684e287": {
//     name: "gurugrupa test receiver 2",
//     available: 50000,
//     used: 0,
//     total: 50000,
//     requested: 0
//   }
// }

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
            <option value={c}> {creditInfo[c].name} </option>
          ))}
        </Select>
        )}
      </HStack>
        <AddInvoiceDrawer />
      <Divider />
      <HStack>
      <Center>
        <Box w="">
          <Grid templateColumns={"repeat(" + 5 + ", 1fr)"} gap={3}>
            <Box width="100%" textAlign="center" bg="gray.100">
              Order ID
            </Box>
            <Box width="100%" textAlign="center" bg="gray.100">
              Invoice Amount
            </Box>
            <Box width="100%" textAlign="center" bg="gray.100">
              Shipment Status
            </Box>
            <Box width="100%" textAlign="center" bg="gray.100">
              Status
            </Box>
            <Box width="100%" textAlign="center" bg="gray.100">
              Details
            </Box>
          </Grid>

          {filteredInvoices().sort((a,b) => {return parseInt(b.orderId) - parseInt(a.orderId);})
          // .filter((l) => l.status == "NONE")
            .map((l, idx) => (
              <>
                <Grid
                  p="10px"
                  h="90px"
                  templateColumns={"repeat(" + 5 + ", 1fr)"}
                  gap={3}
                  key={"loan_" + idx}
                >
                  <Box width="100%" textAlign="center">
                    {l.orderId}
                  </Box>
                  <Box width="100%" textAlign="center">
                    <Currency amount={l.value}/>
                  </Box>
                  <Box width="100%" textAlign="center">
                    {l.shippingStatus}
                  </Box>
                  <Box width="100%" textAlign="center">
                    {l.status}
                  </Box>
                  <Box width="100%" textAlign="center">
                    {/* <Button size="sm" onClick={() => handleFinance(l.invoiceId)} disabled={l.status!=="NONE"}>Repayment Info</Button> */}
                    <Button size="sm" onClick={() => showDetails(l.invoiceId)} >...</Button>
                  </Box>
                </Grid>
              </>
            ))}
        </Box>
      </Center>
      </HStack>
    </VStack>
    </>
  )
}

export default LenderDashboard
