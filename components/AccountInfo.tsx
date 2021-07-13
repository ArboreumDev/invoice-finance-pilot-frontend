
import {Invoice, fetcher, SupplierInfo} from "./Main"
import {
  Box, Button, Divider, Grid, Heading, HStack, Text, VStack, Spinner, Center,
  AlertIcon,
  Select,
  AlertTitle,
  Flex,
  Progress,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Tooltip,
  Wrap,

} from "@chakra-ui/react"
import DynamicDoughnut, {color1, color2, color3} from "./doughnut"
import React, { useState } from "react";
import { dec_to_perc } from "../lib/currency"
import { Currency } from "../components/common/Currency"
import {FinanceStatus, ReceiverInfo} from "../components/Main"
import {ReceiverDetails} from "../components/ReceiverDetails"
import CreditlinesTable, {CreditLineInfo, CreditSummary} from "./CreditlinesTable"
import {principalToInterest} from "./../lib/invoice"


const CreditLines = (props: { creditLines: CreditLineInfo[] }) => {
  const cols = [
    "Customer Name",
    "Requested and Pending",
    "Used Credit",
    "Available Credit",
    // "Amount Repaid",
    "Total Credit Line Size",
    "Number of Invoices",
    "Contact"
  ]

  return (
    <Stack spacing="15px">
      <Box>
        <Heading size="md">Credit Lines</Heading>
      </Box>

      <Grid templateColumns={"repeat(" + cols.length + ", 1fr)"} gap={3}>
        {cols.map((c) => (
          <Box width="100%" textAlign="center" bg="gray.100" key={"col" + c}>
            {c}
          </Box>
        ))}
      </Grid>

      {props.creditLines.map((creditLine, idx) => (
        <Grid
          key={"inv_" + idx}
          templateColumns={"repeat(" + cols.length + ", 1fr)"}
          gap={3}
        >
          <Box verticalAlign="center" width="100%" textAlign="center">
            <Text>{creditLine.info.name}, {creditLine.info.city}</Text>
          </Box>
          <Box width="100%" textAlign="center">
            <Currency amount={creditLine.requested} />
          </Box>
          <Box width="100%" textAlign="center">
            <Currency amount={creditLine.used} />
          </Box>
          <Box width="100%" textAlign="center">
            <Currency amount={creditLine.available} />
          </Box>
          <Box width="100%" textAlign="center">
            <Currency amount={creditLine.total} />
          </Box>
          <Box width="100%" textAlign="center">
            {creditLine.invoices} 
          </Box>
          <Box width="100%" textAlign="center">
            <ReceiverDetails receiver={creditLine.info} />
          </Box>
        </Grid>
      ))}
    </Stack>
  )
}

const Asset = (title: string, amount: number) => (
  <Flex minW={300} maxW={400} borderWidth={3} borderRadius="lg" padding={5}>
    <Box flex={0.5}>{title}</Box>
    <Box flex={0.5} textAlign="right">
      <Currency amount={amount} />
    </Box>
  </Flex>
)
const AllocatedAsset = (title: string, percentage: number, color?: string) => (
  <Flex>
    <Box flex={0.7}>
      <Text color={color} fontWeight="semibold" fontSize="lg">
        {title}
      </Text>
    </Box>
    <Box flex={1}>
      <Progress
        marginTop="5px"
        size="lg"
        colorScheme="gray"
        value={percentage}
      />
    </Box>
    <Box flex={0.4} textAlign="right">
      <Text color={color} fontSize="lg">
        {percentage}%
      </Text>
    </Box>
  </Flex>
)
interface VendorAccountInfoProps {
  invoices: Invoice[],
  isLoading: boolean,
  isError: any,
  creditInfo: CreditSummary,
  suppliers: SupplierInfo[]
}


const AccountInfo = ({invoices, isLoading, isError, creditInfo, suppliers}: VendorAccountInfoProps) => {
  const [view, setView] = useState("tusker")

  if (isLoading) {
    return <Heading as="h2" size="lg" fontWeight="400" color="gray.500">
        <Center>
          <Spinner />
        </Center>
      </Heading>
  }

  if (isError) {
    return <Heading as="h2" size="lg" fontWeight="400" color="gray.500">
        There was an error
      </Heading>
  }

  const creditLines = Object.values(creditInfo[view])

  const filteredInvoices = invoices.filter(i => view != "tusker"? i.supplierId == view : true )

  const invoicesFunded = filteredInvoices.filter(i => [FinanceStatus.FINANCED].includes(i.status)) //.map(i => i.value).reduce((a, b) => a + b, 0)
  const invoicesPaidBack = filteredInvoices.filter(i => [FinanceStatus.REPAID].includes(i.status)) //.map(i => i.value).reduce((a, b) => a + b, 0)
  const invoicesRequested = filteredInvoices.filter(i => [FinanceStatus.DISBURSAL_REQUESTED, FinanceStatus.INITIAL].includes(i.status)) //.map(i => i.value).reduce((a, b) => a + b, 0)
  
  const totalPaidBack = invoicesPaidBack.map(i => i.value).reduce((a,b) => a+b, 0)
  const totalAvailable = creditLines.map(c => c.available).reduce((a,b) => a+b, 0)
  const totalUsed = creditLines.map(c => c.used).reduce((a,b) => a+b, 0)
  const totalRequested = creditLines.map(c => c.requested).reduce((a,b) => a+b, 0)
  const total = totalAvailable + totalUsed + totalRequested
  const percUsed = dec_to_perc(totalUsed / total, 1)
  const percAvailable = dec_to_perc(totalAvailable / total, 1)
  const percRequested = dec_to_perc(totalRequested / total, 1)
  // const totalDebt = totalUsed * 1.05
  const totalDebt = totalUsed + principalToInterest(totalUsed, 0.0166666, 3)


  let usedAmounts = creditLines.map(c => c.used)
  let requestedAmounts = creditLines.map(c => c.requested)
  let amounts = requestedAmounts.concat(usedAmounts)
  amounts.push(totalAvailable)

  let _names = creditLines.map(c => c.info.name)
  let names = _names.concat(_names)
  names.push("available")


  return (
    <>
      <Box margin={[0, 1, 2, 3]} padding={[2, 3, 4, 5]}>


      <Select onChange={(e)=> setView(e.target.value)}>
          <option value='tusker' selected> All Suppliers </option>
          { suppliers && ( suppliers.map((s) => (
            // eslint-disable-next-line react/jsx-key
            <option value={s.id}> {s.name} </option>
            )))}
        </Select>



        <Stack w="100%" spacing={8}>
          <HStack spacing={20} marginTop={1}>
            <Stat>
              <StatLabel fontSize="lg">
                  <Tooltip label="assuming payback after 90 days">
                    Total Current Debt
                  </Tooltip>
                </StatLabel>
              <StatNumber fontSize="3xl">
                <Currency amount={totalDebt} />
              </StatNumber>
            </Stat>
            </HStack>

          <Heading size="md">Account Overview</Heading>
          <HStack spacing={20} marginTop={1}>
            <Stat>
              <StatLabel fontSize="lg">Available Credit</StatLabel>
              <StatNumber fontSize="3xl">
                <Currency amount={totalAvailable} />
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel fontSize="lg">
                Invoices Requested ({invoicesRequested.length})
                </StatLabel>
              <StatNumber fontSize="3xl">
                <Currency amount={totalRequested} />
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel fontSize="lg">
                Invoices Financed ({invoicesFunded.length})
                </StatLabel>
              <StatNumber fontSize="3xl">
                <Currency amount={totalUsed} />
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel fontSize="lg">
                Invoices Repaid ({invoicesPaidBack.length})
                </StatLabel>
              <StatNumber fontSize="3xl">
                <Currency amount={totalPaidBack} />
              </StatNumber>
            </Stat>
          </HStack>

          <>
            <Heading size="md">Credit Allocation</Heading>
            <Wrap w="100%" spacing={[8, 0, 0, 0]}>
              <Divider display={["none", "block"]} orientation="vertical" />

            <Center minW={280} maxW="sm"> 
              <Box w={160}> 
                <DynamicDoughnut amounts={amounts} labels={names} />
              </Box> 
             </Center>
              <Center minW={320} maxW="sm"> 
                <Stack w="100%" spacing={6}>
                  {AllocatedAsset("Requested", percRequested, color1)}
                  {AllocatedAsset("Used", percUsed, color2)}
                  {AllocatedAsset("Available", percAvailable, color3)}
                  {/* <Wrap w="100%">
                  {creditLines.map((c) => ( 
                    AllocatedAsset(c.name, parseFloat((c.used + c.requested) / c.available, 2).toFixed(2), "teal.500")
                  ))}
                  </Wrap> */}
                </Stack>
              </Center> 
            </Wrap>
          </>
          <Box minW="xl">
            <CreditlinesTable creditLines={creditLines} />
          </Box>
        </Stack>
      </Box>
    </>
  )
} 

export default AccountInfo