import {
  Box
} from "@chakra-ui/react"
import React, { useState } from "react";
import axiosInstance from "../../utils/fetcher"
import { SupplierInfo, Terms } from "../Main";
import {TuskerSearch} from "../common/TuskerSearch";
import {defaultTuskerCreditLineSize, defaultTuskerTenor, defaultTuskerApr} from "../common/constants";
import {ChakraModal} from "../common/ChakraModal";
import {error, success} from "../common/popups";

export const AddSupplierModal = () => {
    const [loading, setLoading] = useState(false)
    const [receiver, setReceiver] = React.useState("")
    const [newApr, setNewApr] = useState(defaultTuskerApr)
    const [newCreditLimit, setNewCreditLimit] = useState(defaultTuskerCreditLineSize)
    const [newTenor, setNewTenor] = useState(defaultTuskerTenor)
    const [searchResults, setSearchResults] = useState([])
    const [close, setClose] = useState(false)

    const submit = async () => {
        setLoading(true)
        const receiverInfo = searchResults.filter((s) => s.id === receiver)[0]
        axiosInstance.post(
            "/v1/supplier/new",
            {
                supplier: {
                    id: receiverInfo.id,
                    name: receiverInfo.name,
                    defaultTerms: {
                            apr: newApr,
                            tenorInDays: newTenor,
                            creditlineSize: newCreditLimit
                        } as Terms
                    } as SupplierInfo
            })

        .then((result)=>{
            setLoading(false)
            if (result.status === 200) {
                success("Supplier has been added!")
            }
            setReceiver("")
            setSearchResults([])
            setClose(true)
            setClose(false)
        })
        .catch((err) => {
            setLoading(false)
            console.log('err', err)
            const message = err.response?.data?.detail || "Unknown Error"
            error(message)
        })
    }

    return (
        <>
            <ChakraModal buttonText={"Add new"} heading={"New supplier"}
                         body={
                             <Box>
                                <TuskerSearch
                                    submit={submit}
                                    loading={loading}
                                    receiver={receiver}
                                    setReceiver={setReceiver}
                                    searchResults={searchResults}
                                    setSearchResults={setSearchResults}
                                    defaultApr={defaultTuskerApr}
                                    newApr={newApr}
                                    setNewApr={setNewApr}
                                    defaultCreditLimit={defaultTuskerCreditLineSize}
                                    newCreditLimit={newCreditLimit}
                                    setNewCreditLimit={setNewCreditLimit}
                                    defaultTenor={defaultTuskerTenor}
                                    newTenor={newTenor}
                                    setNewTenor={setNewTenor} />
                            </Box>
                         }
                         footer={""}
                         close={close} />
        </>
    )
}