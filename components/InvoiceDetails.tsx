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



export const InvoiceDetails = ({invoice}: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
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
                        <Tbody>
                            <Tr>
                                <Td>receiver</Td>
                                <Td isNumeric>{invoice.receiverInfo.name}</Td>
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
                                <Td>loan ID</Td>
                                <Td isNumeric>{invoice.paymentDetails.loanId}</Td>
                            </Tr>
                            <Tr>
                                <Td>invoice value</Td>
                                <Td isNumeric>{invoice.value}</Td>
                            </Tr>
                            <Tr>
                                <Td>principal</Td>
                                <Td isNumeric>{invoice.paymentDetails.principal}</Td>
                            </Tr>

                            <Tr>
                                <Td>Interest due after 90 days</Td>
                                <Td isNumeric>{invoice.paymentDetails.interest}</Td>
                            </Tr>
                            <Tr>
                                <Td>status</Td>
                                <Td isNumeric>{invoice.status}</Td>
                            </Tr>
                            <Tr>
                                <Td>delivered on</Td>
                                <Td isNumeric>{invoice.deliveredOn}</Td>
                            </Tr>

                             <Tr>
                                <Td>disbursal time by loan admin (UTC+0)</Td>
                                <Td isNumeric>{invoice.financedOn}</Td>
                            </Tr> 

                            <Tr>
                                <Td>disbursal transaction ID </Td>
                                <Td isNumeric>{invoice.paymentDetails.disbursalTransactionId}</Td>
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