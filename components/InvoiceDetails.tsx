import {
    Modal,
    ModalOverlay,
    Divider,
    ModalContent,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    Box,
    Center,
    Text,
    HStack,
    VStack,
  Flex,
  Progress,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Tooltip,
 
  } from "@chakra-ui/react"
import {Invoice} from "./Main"
import { Currency } from "../components/common/Currency"

interface Props {
    invoice: Invoice
}



export const InvoiceDetails = ({invoice}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    console.log('got', invoice)
    return (
      <>
        <Button onClick={onOpen}>...</Button>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Invoice Details: {invoice.orderId}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Box width="90%">
                        <Table size="lg" variant="simple" >
                        {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
                        {/* <Thead> */}
                            {/* <Tr>
                            <Th>To convert</Th>
                            <Th>into</Th>
                            <Th isNumeric>multiply by</Th>
                            </Tr> */}
                        {/* </Thead> */}
                        <Tbody>
                            <Tr>
                                <Td>receiver</Td>
                                <Td isNumeric>{invoice.receiverInfo.receiverName}</Td>
                            </Tr>
                            <Tr>
                                <Td>invoice ID</Td>
                                <Td isNumeric>{invoice.invoiceId}</Td>
                            </Tr>
                            <Tr>
                                <Td>order ID</Td>
                                <Td isNumeric>{invoice.orderId}</Td>
                            </Tr>
                            <Tr>
                                <Td>invoice value</Td>
                                <Td isNumeric>{invoice.value}</Td>
                            </Tr>

                            <Tr>
                                <Td>status</Td>
                                <Td isNumeric>{invoice.status}</Td>
                            </Tr>

                            <Tr>
                                <Td>request reference number</Td>
                                <Td isNumeric>{invoice.paymentDetails.requestId}</Td>
                            </Tr>

                            <Tr>
                                <Td>repayment reference number</Td>
                                <Td isNumeric>{invoice.paymentDetails.repaymentId}</Td>
                            </Tr>
                            <Divider></Divider> 
                            <Tr>
                                <Td>collection date</Td>
                                <Td isNumeric>{invoice.paymentDetails.collectionDate || "tbd"}</Td>
                            </Tr>
                            <Tr>
                                <Td>request date</Td>
                                <Td isNumeric>{invoice.paymentDetails.startDate || "tbd"}</Td>
                            </Tr>
                        </Tbody>
                        </Table>
                </Box>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }