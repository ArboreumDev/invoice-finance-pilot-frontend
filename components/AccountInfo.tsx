
import {Invoice, fetcher, axiosInstance} from "./Main"
import {Box, Button, Grid, Heading, HStack, Text} from "@chakra-ui/react"

interface Props {
  invoices: Invoice[],
  isLoading: boolean,
  isError: Object
}

const AccountInfo = ({invoices, isLoading, isError}: Props) => {
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
  const totalFunded = invoices.filter(i => ["DISBURSAL_REQUESTED", "FINANCED"].includes(i.status)).map(i => i.value).reduce((a, b) => a + b, 0)
  return (
      <>
        <Box p={3} w="md" h="400px" >
        <div>
          <p> total funded: { totalFunded} </p>
          <p> total debt: {totalFunded * 1.2} </p>
          <p>TODO breakdown of free credit by customer</p>
        </div>
      </Box>
            </>
        )
        } 

export default AccountInfo