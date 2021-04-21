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
import {Invoice, ReceiverInfo} from "./Main"

interface Props {
    receiver: ReceiverInfo
}



export const ReceiverDetails = ({receiver}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
      <>
        <Button onClick={onOpen}>...</Button>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Receiver Details: {receiver.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Box width="90%">
                        <Table size="lg" variant="simple" >
                        <Tbody>
                            <Tr>
                                <Td>name</Td>
                                <Td isNumeric>{receiver.name}</Td>
                            </Tr>
                            <Tr>
                                <Td>phone</Td>
                                <Td isNumeric>{receiver.phone}</Td>
                            </Tr>
                            <Tr>
                                <Td>city</Td>
                                <Td isNumeric>{receiver.city}</Td>
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