
import {Invoice, SupplierInfo} from "./Main"
import {
  Box, Divider, Grid, Heading, HStack, Text, VStack, Spinner, Center,
  Select,
  Flex,
  Tag,
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
import { Currency } from "./common/Currency"
import {FinanceStatus } from "./Main"
import {ReceiverDetails} from "./ReceiverDetails"
import CreditlinesTable, {CreditLineInfo, CreditSummary} from "./CreditlinesTable"
import {principalToInterest} from "../lib/invoice"
import { InfoIcon } from '@chakra-ui/icons'
import { InvoiceDetails } from "./InvoiceDetails";


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
  creditInfo: CreditSummary,
  suppliers: SupplierInfo[]
}

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

// a and b are javascript Date objects
function dateDiffInDays(a, b) {
  return Math.floor((a - b) / _MS_PER_DAY);
}


const invoiceToDebt = (i: Invoice, endOfTerm = true) => {
  if (endOfTerm) {
    let t=i.paymentDetails.principal + i.paymentDetails.interest
    return t 
  } else {
    let t=( i.paymentDetails.principal + principalToInterest(
      i.paymentDetails.principal, // amount
      dateDiffInDays(Date.now(), Date.parse(i.financedOn)),
      i.paymentDetails.apr)
    )
      console.log('in', t)
      return t 
  }
}


const AccountInfo = ({invoices, creditInfo, suppliers}: VendorAccountInfoProps) => {
  const [view, setView] = useState("tusker")

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
  const totalFinanced = invoicesFunded.map(i => i.value).reduce((a,b) => a+b, 0)
  // assuming repayment at end of latest possible date
  const totalOutstandingAtEndOfTenor = invoicesFunded.map(i => invoiceToDebt(i)).reduce((a,b) => a+b, 0)
  // assuming repayment before end of day
  const totalLiveDebt = invoicesFunded.map(i => invoiceToDebt(i, false)).reduce((a,b) => a+b, 0)
  // console.log('sffsd', invoicesFunded[0].paymentDetails.interest , invoicesFunded[0].paymentDetails)


  let usedAmounts = creditLines.map(c => c.used)
  let requestedAmounts = creditLines.map(c => c.requested)
  let amounts = requestedAmounts.concat(usedAmounts)
  amounts.push(totalAvailable)

  let _names = creditLines.map(c => c.info.name)
  let names = _names.concat(_names)
  names.push("available")

  // const CustomTag = React.forwardRef(({ children, ...rest }, ref) => (
  //   <Box p="1">
  //     <Tag ref={ref} {...rest}>
  //       {children}
  //     </Tag>
  //   </Box>
  // ))
  


  return (
    <>
      <Box margin={[0, 1, 2, 3]} padding={[2, 3, 4, 5]}>


      <Select onChange={(e)=> setView(e.target.value)}
              value={view}>
          <option value='tusker'> All Suppliers </option>
          { suppliers && ( suppliers.map((s) => (
            <option key={s.id} value={s.id}> {s.name} </option>
            )))}
        </Select>



        <Stack w="100%" spacing={8}>
          <HStack spacing={20} marginTop={1}>
            <Stat>
              <StatLabel fontSize="lg">
                <Stack direction="row">
                  <Text> Financed Invoice Value </Text>
                  <Tooltip label="Total amount of invoices currently financed or requested">
                  <InfoIcon />
                  </Tooltip>
                </Stack>
                </StatLabel>
              <StatNumber fontSize="3xl">
                <Currency amount={totalFinanced} />
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel fontSize="lg">
                <Stack direction="row">
                  <Text> Total Debt </Text>
                  <Tooltip label="total amount due if invoices are being repaid according to terms (at the last possible date) ">
                  <InfoIcon />
                  </Tooltip>
                </Stack>
                </StatLabel>
              <StatNumber fontSize="3xl">
                <Currency amount={totalOutstandingAtEndOfTenor} />
              </StatNumber>
            </Stat>
             <Stat>
              <StatLabel fontSize="lg">
                <Stack direction="row">
                  <Text> Total Live Debt </Text>
                  <Tooltip label="total amount due if all invoices were repaid by the end of this day ">
                  <InfoIcon />
                  </Tooltip>
                </Stack>
                </StatLabel>
              <StatNumber fontSize="3xl">
                <Currency amount={totalLiveDebt} />
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