import {
    Drawer,
    Table,
    Switch,
    Thead,
    Text,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    ModalHeader,
    Divider,
    Box,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Stack, Button, useDisclosure, Input,
    useToast,
    VStack,
    Heading
  } from "@chakra-ui/react"
import React, { useEffect, useState,  } from "react";
import { principalToInterest } from "../lib/invoice";
import axiosInstance from "../utils/fetcher"

const dummyOrder = {
    orderRef: "",
    value: 0,
    status: "",
    shippingStatus: "",
    invoiceId: "",
    receiverInfo: {}
}

interface Props {
  handleSubmit: any
}

function AddInvoiceDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()
  const [isUploaded, setUploaded] = useState(false)
  const [order, setOrder] = useState(dummyOrder)
//   const [error, setError] = useState("")
  const toast = useToast()

  const getOrder = async (orderRef) => {
    console.log('try fund: ', orderRef)
    await axiosInstance.get("/v1/order/" + orderRef)
      .then((result)=>{
        console.log('got', result)
        toast({
            title: "Success!",
            description: "Proceed to upload invoice.",
            duration: 2000
        })
        setOrder({
            orderRef: result.data.orderId,
            value: result.data.value,
            invoiceId: result.data.invoiceId,
            status: result.data.status,
            shippingStatus: result.data.shipping_status,
            receiverInfo: result.data.receiverInfo
        })
        // alert("Tusker has been notified.")
      })
      .catch((err) => {
        let msg = "unknown error"
        if (err.message.includes("404")) {msg = "invoice not found"}
        if (err.message.includes("400")) {msg = "receveiver not whitelisted"}
        setOrder(dummyOrder)
        setUploaded(false)
        toast({
            title: "Error!",
            // TODO display different things by error status
            description: msg,
            status: "error",
            duration: 2000,
            isClosable: true,
          })

      })
}

  const handleFinance = async () => {
    console.log('try fund: ', order.invoiceId)
    axiosInstance.post("/v1/invoice/" +  order.orderRef)
      .then((result)=>{
        console.log('got', result)
        // setResult("success")
        // alert("Tusker has been notified.")
        toast({
            title: "Success!",
            description: "Your request is being processed",
            status: "success",
            duration: 2000,
            isClosable: true,
          })
          onClose()
          setOrder(dummyOrder)
          setUploaded(false)

      })
      .catch((err) => {
        toast({
            title: "Error!",
            description: err.response.data.detail || "Unknown Error",
            status: "error",
            duration: 2000,
            isClosable: true,
          })
      })
}




  return (
    <>
      <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
        Add New Invoice
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        lockFocusAcrossFrames={true}
        onClose={() => { setOrder(dummyOrder); setUploaded(false); onClose }}
        finalFocusRef={btnRef}
        isCentered={true}
        size="sm"
        onEsc={onClose}
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton onClick={onClose} />
            <DrawerHeader>Finance new invoice</DrawerHeader>

            <DrawerBody>
              <Input placeholder="Enter order reference number" onChange={(e) => getOrder(e.target.value)}/>
              <Box>
                  {order.invoiceId && (
                    <Box>

                    <VStack>
                      <Heading size="md"> Order found!  </Heading>
                        <Table size="lg" variant="simple" >
                        <Tbody>
                            <Tr>
                                <Td>Receiver</Td>
                                <Td isNumeric>
                                  {order.receiverInfo.name}, {' '}
                                  ({order.receiverInfo.city}),{' '}
                                  {order.receiverInfo.phone}
                                  </Td>
                            </Tr>
                            <Tr>
                                <Td>Value</Td>
                                <Td isNumeric>{order.value}</Td>
                            </Tr>
                        </Tbody>
                        </Table>
                        <Divider />
                        <Text>
                          If financed this invoice will accrue the following interest:
                          <p>
                            after one month: {principalToInterest(order.value, 1)}
                          </p>
                          <p>
                            after two months: {principalToInterest(order.value, 2)}
                          </p>
                          <p>
                            after three months: {principalToInterest(order.value, 3)}
                          </p>
                        </Text>
                        <Divider />

                        {/* <p>receiver: {JSON.stringify(order.receiverInfo)}</p> */}
                        <p> I have uploaded a readable photo of the invoice with the ID
                          <b> {order.invoiceId} </b>
                          onto the tusker-backend
                        </p>
                        <Switch onChange={() => setUploaded(!isUploaded)}/>
                        <Divider />

                    </VStack>
                    </Box>
                      )}
              </Box>
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button disabled={!isUploaded} colorScheme="teal" onClick={handleFinance}>Finance</Button>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  )
}

export default AddInvoiceDrawer
