import {
    Drawer,
    Table,
    Tbody,
    Tr,
    Td,
    Divider,
    Box,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button, useDisclosure, Input,
    VStack,
    Heading
  } from "@chakra-ui/react"
import React, { useEffect, useState,  } from "react";
import axiosInstance from "../utils/fetcher"
import {error, success} from "./common/popups";
import {defaultPrepaidInterestPeriod} from "./common/constants";
import {principalToInterest, principalToPrepaidInterest, principalToAccruedInterest} from "../lib/invoice"

const dummyOrder = {
    orderRef: "",
    value: 0,
    status: "",
    shippingStatus: "",
    invoiceId: "",
    receiverInfo: {
      name: null,
      city: null,
      phone: null
    },
    paymentDetails: {
      principal: 0,
      interest: 0,
      apr: 0,
      tenorInDays: 0,
    }
}

interface Props {
  handleSubmit: any
}

function AddInvoiceDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()
  const [order, setOrder] = useState(dummyOrder)
  const [prePaidInterest, setPrepaidInterest] = useState(0)


  const getOrder = async (orderRef) => {
    await axiosInstance.get("/v1/order/" + orderRef)
      .then((result)=>{
        success("Proceed to upload invoice.")
        setPrepaidInterest(
          principalToPrepaidInterest(result.data.paymentDetails.principal, result.data.paymentDetails.apr, false)
        )
        setOrder({
            orderRef: result.data.orderId,
            value: result.data.value,
            invoiceId: result.data.invoiceId,
            status: result.data.status,
            shippingStatus: result.data.shipping_status,
            receiverInfo: result.data.receiverInfo,
            paymentDetails: result.data.paymentDetails
        })
      })
      .catch((err) => {
        let msg = "unknown error"
        if (err.message.includes("404")) {msg = "invoice not found"}
        if (err.message.includes("400")) {
          console.log('error is', err.response?.data?.detail)
          msg = `receveiver not whitelisted: ${err.response?.data?.detail}`
        }
        setOrder(dummyOrder)
        setPrepaidInterest(0)
        error(msg) // TODO display different things by error status
      })
}

  const handleFinance = async () => {
    axiosInstance.post("/v1/invoice/" +  order.orderRef)
      .then((result)=>{
          success("Your request is being processed")
          onClose()
          setOrder(dummyOrder)
          setPrepaidInterest(0)

      })
      .catch((err) => {
        console.log('errsdf', err)
        const message = err.response?.data?.detail || "Unknown Error"
        error(message)
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
        onClose={() => { setOrder(dummyOrder); onClose }}
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
                        <text>
                          <p> principal: {Math.ceil(order.paymentDetails.principal)} </p>
                          <p> apr: {order.paymentDetails.apr * 100}{'%'} </p>
                          <p> pre-paid interest (after 30 days): {prePaidInterest.toFixed(2)} </p>
                          <p> interest after {order.paymentDetails.tenorInDays} days:  {order.paymentDetails.interest.toFixed(2)}</p>
                        </text>
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
              <Button  colorScheme="teal" onClick={handleFinance}>Finance</Button>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  )
}

export default AddInvoiceDrawer
