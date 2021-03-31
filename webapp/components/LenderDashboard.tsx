import {Box, Button, Center, Grid, Heading, HStack, Text} from "@chakra-ui/react"
import {Line} from 'react-chartjs-2';
import useSWR from 'swr'
import AmountInput from "./AmountInput"
import AddInvoiceDrawer from "./AddInvoiceDrawer"
import {Invoice, fetcher, axiosInstance} from "./Main"
import { useRouter } from "next/router";
import React, { useEffect } from "react";

interface Props {
  invoices: Invoice[],
  isLoading: boolean,
  isError: Object
}

const LenderDashboard = ({invoices, isLoading, isError}: Props) => {
  // const [invoice, setInvoice] = useState("")

  const onInvest = () => {
    // invest in loan
    console.log("invested")
  }  
  
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

  const chart_options = {
    maintainAspectRatio: false
  }

  return (
    <>
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
              Action
            </Box>
          </Grid>

          {invoices.sort((a,b) => {return parseInt(b.orderId) - parseInt(a.orderId);})
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
                    {l.value}
                  </Box>
                  <Box width="100%" textAlign="center">
                    {l.shippingStatus}
                  </Box>
                  <Box width="100%" textAlign="center">
                    {l.status}
                  </Box>
                  <Box width="100%" textAlign="center">
                    <Button size="sm" onClick={() => handleFinance(l.invoiceId)} disabled={l.status!=="NONE"}>Repayment Info</Button>
                  </Box>
                </Grid>
              </>
            ))}
        </Box>
      </Center>
      </HStack>
      <Center>
      <AddInvoiceDrawer />
      </Center>
    </>
  )
}

export default LenderDashboard
