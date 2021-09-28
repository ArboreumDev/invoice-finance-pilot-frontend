import {
    Box,
    Select,
    Image,
    Spinner,
    Text,
    Button,
} from "@chakra-ui/react"
import React, {useEffect, useState} from "react";
import axiosInstance from "./../utils/fetcher"
import {ChakraModal} from "./common/ChakraModal";
import {error, success} from "./common/popups";
import axios from 'axios';
import {Invoice} from "./Main"
import { InvoiceDetails } from "./InvoiceDetails";

interface Props {
  invoice: Invoice,
}


export const ConfirmInvoiceImageModal = (props: Props) => {
    const [fetching, setFetching] = useState(true)
    const [error, setError] = useState(false)
    const [msg, setMsg] = useState("")
    const [updating, setUpdating] = useState(false)
    const [image, setImage] = useState(null)
    const [close, setClose] = useState(false)

    useEffect(() => {
        async function getImage () {
            setFetching(true)
            const url = `/v1/invoice/image/${props.invoice.invoiceId}`
            console.log('fetching', url)
            try {

                const response = await axiosInstance.get(url, {responseType: 'blob'})
                if (response.status === 200) {
                    const imageSrc = URL.createObjectURL(response.data)
                    setImage(imageSrc)
                    setFetching(false)
                    setMsg('')
                } 
            } catch (err) {
                setFetching(false)
                console.log('err', err)
                if (err?.response?.status === 412) {
                    setMsg('No image uploaded')
                }
                if (err?.response?.status === 401) {
                    setMsg('Unauthorized')
                }
                setError(true)
            }
        }
        getImage()
    }, [props.invoice])

    const updateStatus = (newStatus) => {
        setUpdating(true)
        updateVerificationStatus(newStatus)
        setUpdating(false)
        setClose(true)
        setClose(false)
    }

    const updateVerificationStatus = async (newStatus) => {
        // alert(msg)
        const update = { 
            invoiceId: props.invoice.invoiceId,
            signatureVerificationResult: newStatus 
        }
        try {
            const res = await axiosInstance.post( '/v1/admin/update/', {update})
            if (res.status === 200) {
                alert("Updated")
            } else {
            alert("error")
            }
        } catch (err) {
            console.log(err)
            alert(err)
        }
    }


    return (
      <ChakraModal
          buttonText={"verify"}
          heading={"Confirm invoice document for order " + props.invoice.orderId}
          body={
              <>
                <Box>Please confirm that the uploaded invoice is signed and has this ID:</Box>
                <Box> <b> {props.invoice.invoiceId} </b> </Box>
                {error && (
                    <Text>Error: {msg || "Unknown"}</Text>
                )}
                {fetching && !error && (
                    <Spinner />
                )}
                {image && (
                    <div>
                        <Image 
                            src={image}
                            alt={'invoice for order'+ props.invoice.orderId}
                        />
                    </div> 
                )}
            </>
          }
          footer={
              <>
               <Button 
                colorScheme="orange" mr={3} onClick={() => updateStatus('INVALID')}
                disabled={error || fetching} 
                >
                    {updating ? <Spinner /> : "Flag as Invalid"  }
                </Button>

               <Button 
                colorScheme="teal" mr={3} onClick={() => updateStatus('VALID')}
                disabled={error || fetching} 
                >
                    {updating ? <Spinner /> : "Confirm Invoice!"  }
                </Button>
                </>
          }
          close={close} />
    )
}
 