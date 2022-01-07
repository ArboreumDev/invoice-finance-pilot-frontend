import React, {useState} from "react";
import axiosInstance from "../../utils/fetcher"
import {ChakraModal} from "../common/ChakraModal";
import {error, success} from "../common/popups";
import {Box, Input, Button, Spinner} from "@chakra-ui/react";

interface PurchaserUpdateInput {
    purchaserId: string
    creditLimit: number
}


 export const ModCreditLimitModal = (props: { 
   creditLimit: number,
   purchaserId: string,
   name: string
  }
  ) => {
    const [newCreditLimit, setNewCreditLimit] = useState(null)
    const [loading, setLoading] = useState(false)
    const [close, setClose] = useState(false)


    const update = () => {
        const endpoint = "/v1/purchaser/update"
        const params = {
            purchaserId: props.purchaserId,
            creditLimit: newCreditLimit !== null ? newCreditLimit : props.creditLimit
        } as PurchaserUpdateInput
        setLoading(true)
        axiosInstance.post(endpoint, {update: params})
        .then((result)=>{
            setLoading(false)
            if (result.status === 200) {
                success("Creditlimit has been modified!")
            }
            setClose(true)
            setClose(false)
        })
        .catch((err) => {
            setLoading(false)
            const message = err.response?.data?.detail || "Unknown Error"
            error(message)
        })
    }

    return (
      <ChakraModal
          buttonText={"edit"}
          heading={"Modify Credit Limit for " + props.name}
          body={
                <>
                <Box>
                    <Input
                        m={2}
                        width="300px"
                        onChange={(e) => setNewCreditLimit(parseFloat(e.target.value))}
                        placeholder={"current limit: " + props.creditLimit}
                    />
                </Box>
                </>
          }
          footer={
               <Button colorScheme="teal" mr={3} onClick={update}
                disabled={!(newCreditLimit || (!props.purchaserId ))}
                >
                    {!loading ? "Submit" : <Spinner />}
                </Button>
          }
          close={close} />
    )
}