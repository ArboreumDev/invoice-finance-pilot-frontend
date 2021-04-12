
import {Invoice, fetcher, axiosInstance} from "./Main"
import {
  Box, Button, Divider, Grid, Heading, HStack, Text, VStack, Spinner, Center,
  AlertIcon,
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
import DynamicDoughnut from "./doughnut"
import { dec_to_perc } from "../lib/currency"
import { Currency } from "../components/common/Currency"
import {FinanceStatus} from "../components/Main"




interface CreditLineInfo {
  used: number
  name: string
  requested: number
  total: number
  available: number
}

const CreditLines = (props: { creditLines: CreditLineInfo[] }) => {
  const cols = [
    "Customer Name",
    "Requested and Pending",
    "Used Credit",
    "Available Credit",
    // "Amount Repaid",
    "Total Credit Line Size",
    "Number of Invoices",
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
            <Text>{creditLine.name}</Text>
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
            {1}
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
  user: User
  loading?: boolean
}

interface VendorAccountInfoProps {
  invoices: Invoice[],
  isLoading: boolean,
  isError: Object,
  creditLines: CreditLineInfo[],
}


const AccountInfo = ({invoices, isLoading, isError, creditLines}: VendorAccountInfoProps) => {
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
  const invoicesFunded = invoices.filter(i => [FinanceStatus.FINANCED].includes(i.status)) //.map(i => i.value).reduce((a, b) => a + b, 0)
  const invoicesPaidBack = invoices.filter(i => [FinanceStatus.REPAID].includes(i.status)) //.map(i => i.value).reduce((a, b) => a + b, 0)
  const invoicesRequested = invoices.filter(i => [FinanceStatus.DISBURSAL_REQUESTED, FinanceStatus.INITIAL]) //.includes(i.status)).map(i => i.value).reduce((a, b) => a + b, 0)

  const totalAvailable = creditLines.map(c => c.available).reduce((a,b) => a+b, 0)
  const totalUsed = creditLines.map(c => c.used).reduce((a,b) => a+b, 0)
  const totalRequested = creditLines.map(c => c.requested).reduce((a,b) => a+b, 0)
  const total = totalAvailable + totalUsed + totalRequested
  const percUsed = dec_to_perc(totalUsed / total, 1)
  const percAvailable = dec_to_perc(totalAvailable / total, 1)
  const percRequested = dec_to_perc(totalRequested / total, 1)

  const totalDebt = totalUsed * 1.2

  let amounts = creditLines.map(c => c.used + c.requested)
  let names = creditLines.map(c => c.name)
  amounts.push(totalAvailable)
  names.push("available")


  return (
    <>
      <Box margin={[0, 1, 2, 3]} padding={[2, 3, 4, 5]}>
        <Stack w="100%" spacing={8}>
          <HStack spacing={20} marginTop={1}>
            <Stat>
              <StatLabel fontSize="lg">Total Debt</StatLabel>
              <StatNumber fontSize="3xl">
                <Currency amount={totalDebt} />
              </StatNumber>
            </Stat>
            </HStack>
          <Heading size="md">Account Overview</Heading>
          <HStack spacing={20} marginTop={1}>
            <Stat>
              <StatLabel fontSize="lg">Invoices Requested</StatLabel>
              <StatNumber fontSize="3xl">
                {invoicesRequested.length}
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel fontSize="lg">Invoices Financed</StatLabel>
              <StatNumber fontSize="3xl">
                {invoicesFunded.length}
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel fontSize="lg">Invoices Repaid</StatLabel>
              <StatNumber fontSize="3xl">
                {invoicesPaidBack.length}
              </StatNumber>
            </Stat>
          </HStack>
          <Stack spacing={20} w="100%">
            <Wrap w="100%" margin={2}>
              {Asset("Total Requested", totalRequested)}
              {Asset("Total Used Credit", totalUsed)}
              {Asset("Total Available", totalAvailable)}
              {/* {Asset("Total Debt", totalDebt)} */}
            </Wrap>
          </Stack>

          <>
            <Heading size="md">Credit Allocation</Heading>
            <Wrap w="100%" spacing={[8, 0, 0, 0]}>
              <Center minW={280} maxW="sm">
                <Box w={160}>
                  <DynamicDoughnut
                    amounts={amounts}
                    labels={names}
                  />
                </Box>
              </Center>
              <Divider display={["none", "block"]} orientation="vertical" />
              <Center minW={320} maxW="sm">
                <Stack w="100%" spacing={6}>
                  {AllocatedAsset("Requested", percRequested, "gray.500")}
                  {AllocatedAsset("Used", percUsed, "teal.500")}
                  {AllocatedAsset("Available", percAvailable, "gray.500")}
                </Stack>
              </Center>
            </Wrap>
          </>
          <Box minW="xl">
            <CreditLines creditLines={creditLines} />
          </Box>
        </Stack>
      </Box>
    </>
  )
} 

export default AccountInfo