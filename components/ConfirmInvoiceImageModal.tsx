import {
    Box,
    Image,
    Spinner,
    Text,
    Button, Wrap, WrapItem,
} from "@chakra-ui/react"
import React, {useEffect, useState} from "react";
import axiosInstance from "./../utils/fetcher"
import {ChakraModal} from "./common/ChakraModal";
import {Invoice} from "./Main"

interface Props {
    invoice: Invoice,
}


export const ConfirmInvoiceImageModal = (props: Props) => {
    const [fetching, setFetching] = useState(true)
    const [error, setError] = useState(false)
    const [msg, setMsg] = useState("")
    const [updating, setUpdating] = useState(false)
    const [images, setImages] = useState(null)
    const [close, setClose] = useState(false)

    useEffect(() => {
        async function getImage() {
            setFetching(true)
            const url = `/v1/invoice/image/${props.invoice.invoiceId}`
            console.log('fetching', url)
            try {
                const response = await axiosInstance.get(url)
                if (response.status === 200) {
                    const images = response.data["images"]
                    setImages(images)
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
            const res = await axiosInstance.post('/v1/admin/update/', {update})
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
            size={"full"}
            heading={"Confirm invoice document for order " + props.invoice.orderId}
            body={
                <>
                    <Box>Please confirm that the uploaded invoice is signed and has a stamp:</Box>
                    {error && (
                        <Text>Error: {msg || "Unknown"}</Text>
                    )}
                    {fetching && !error && (
                        <Spinner/>
                    )}
                    <Box>
                        <Wrap>
                            {images && images.map((image: string) => (
                                <WrapItem>
                                    <Image
                                        key={image}
                                        src={image}
                                        alt={'invoice for order' + props.invoice.orderId}
                                    />
                                </WrapItem>
                            ))}
                        </Wrap>
                    </Box>
                </>
            }
            footer={
                <>
                    <Button
                        colorScheme="orange" mr={3} onClick={() => updateStatus('INVALID')}
                        disabled={error || fetching}
                    >
                        {updating ? <Spinner/> : "Flag as Invalid"}
                    </Button>

                    <Button
                        colorScheme="teal" mr={3} onClick={() => updateStatus('VALID')}
                        // disabled={error || fetching}
                    >
                        {updating ? <Spinner/> : "Confirm Invoice!"}
                    </Button>
                </>
            }
            close={close}/>
    )
}
 