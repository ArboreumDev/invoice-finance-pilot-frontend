import {
    Drawer,
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
    VStack
  } from "@chakra-ui/react"
import React, { useEffect, useState,  } from "react";
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
  const [orderId, setOrderId] = useState("")
  const [order, setOrder] = useState(dummyOrder)
//   const [result, setResult] = useState("")
//   const [error, setError] = useState("")
  const toast = useToast()

  const getOrder = async (orderRef) => {
    console.log('try fund: ', orderRef)
    await axiosInstance.get("/v1/order/" + orderRef)
      .then((result)=>{
        console.log('got', result)
        toast({
            title: "Invoice Found!",
            description: "sdf",
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
        console.log('err', err.message)
        console.log('err', err.status)
        setOrder(dummyOrder)
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

      })
      .catch((err) => {
        console.log('err', err)
        // setError("error")
        toast({
            title: "Error!",
            // TODO display different things by error status
            description: "Invoice already selected",
            status: "error",
            duration: 2000,
            isClosable: true,
          })
      })
}




  return (
    <>
      <Button width="100%" ref={btnRef} colorScheme="teal" onClick={onOpen}>
        Add New Invoice
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        lockFocusAcrossFrames={true}
        onClose={() => {setOrder(dummyOrder); onClose}}
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
              {/* <Input placeholder="Enter order reference number" onChange={(e) => setOrderId(e.target.value)}/> */}
              <Input placeholder="Enter order reference number" onChange={(e) => getOrder(e.target.value)}/>
              <Box>
                  {order.invoiceId && <div>
                    <VStack>

                      Order found!
                        <p>Value: {order.value}</p>
                        <p>receiver: {JSON.stringify(order.receiverInfo)}</p>
                        <p>reference number:  {order.orderRef}</p>
                        <p> please upload the invoice with the number: </p>
                        <h4> {order.invoiceId} </h4>
                        <Input placeholder="upload invoice here (TODO)" />
                        <Divider />

                    </VStack>
                      </div>}
              </Box>
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="teal" onClick={handleFinance}>Finance</Button>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  )
}

export default AddInvoiceDrawer
