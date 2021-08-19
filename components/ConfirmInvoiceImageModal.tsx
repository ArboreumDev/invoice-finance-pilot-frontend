import {
    Box,
    Select,
    Spinner,
    Text,
    Button,
} from "@chakra-ui/react"
import React, {useEffect, useState} from "react";
import axiosInstance from "./../utils/fetcher"
import {ChakraModal} from "./common/ChakraModal";
import {error, success} from "./common/popups";
import axios from 'axios';

interface Props {
  invoiceId: string,
  orderRef: string,
  setConfirmation: React.Dispatch<React.SetStateAction<any>>,
  invoiceDocId: string,
}


const TUSKER_S3_BUCKET_URL = "https://fleet-non-prod.s3.amazonaws.com/consgt"
const TUSKER_REFERER_URL = "https://tusker-staging.logistimo.com/"

export const ConfirmInvoiceImageModal = (props: Props) => {
    const [fetching, setFetching] = useState(true)
    const [error, setError] = useState(false)
    const [image, setImage] = useState(null)
    const [close, setClose] = useState(false)

    useEffect(() => {
        props.setConfirmation(false)
        // all illegal hacks:
        // window.history.replaceState(null, '', TUSKER_REFERER_URL)

        // delete window.document.referrer;
        // window.document.__defineGetter__('referrer', function () {
        //     return "yoururl.com";
        // });
        // Object.defineProperty(window.document, "referrer", {get : function(){ return TUSKER_REFERER_URL }});

        axios.get(
            `${TUSKER_S3_BUCKET_URL}/${props.invoiceDocId}`, 
            {
                headers: {Referer: TUSKER_REFERER_URL}
            }
        ).then(response => {
            setFetching(false)
            console.log(response)
            setImage("TODO")
        }).catch(err => {
            console.log(err)
            setError(true)
        })
    }, [])

    const confirm = () => {
        props.setConfirmation(true)
        setClose(true)
        // setClose(false)
    }


    return (
      <ChakraModal
          buttonText={"Verify uploaded invoice"}
          heading={"Confirm invoice document for order " + props.orderRef}
          body={
              <>
                <Box>Please confirm that the uploaded invoice has this ID:</Box>
                <Box> <b> {props.invoiceId} </b> </Box>
                {error && (
                    <Text>Error</Text>
                )}
                {fetching && !error && (
                    <Spinner />
                )}
                {image && (
                    <div>TODO</div> 
                )}
            </>
          }
          footer={
               <Button 
                colorScheme="teal" mr={3} onClick={confirm}
                // disabled={error || fetching} 
                // disabled={error || fetching} 
                >
                    Confirm Invoice!
                </Button>
          }
          close={close} />
    )
}
 