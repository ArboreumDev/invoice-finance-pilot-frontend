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

// const IMAGE = "https://fleet-non-prod.s3.amazonaws.com/consgt/doc_c7d555a8-77f8-4c1f-a096-52497345cdc1.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20220110T152011Z&X-Amz-SignedHeaders=host&X-Amz-Expires=259200&X-Amz-Credential=AKIAIHZGPUAKSBOYBLUQ%2F20220110%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=e4880c4b47d216ea7d3f24d9d3f7b155b40a9eebce23393daa778ba7f9bf8bf4"


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
                setError(false)
                const response = await axiosInstance.get(url)
                if (response.status === 200) {
                    const images = response.data["images"]
                    setImages(images)
                    setFetching(false)
                    setMsg('')
                }
                setError(false)
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
                    {!fetching && (error || msg)  && (
                        <Text>Error: {msg || "Unknown Error"}</Text>
                    )}
                    {fetching && !error && (
                        <Spinner/>
                    )}
                    {!fetching && !error && (
                        <Box>
                        <Wrap>
                            {images && images.map((image: string) => (
                                <WrapItem key={image} >
                                    <Image
                                        src={image}
                                        alt={'invoice for order' + props.invoice.orderId}
                                        />
                                </WrapItem>
                            ))}
                        </Wrap>
                        </Box>
                    )}
                </>
            }
            footer={
                <>
                    <Button
                        colorScheme="orange" mr={3} onClick={() => updateStatus('INVALID')}
                        // disabled={error || fetching}
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
 