import {
    Box,
    Select,
    Spinner,
    Button,
} from "@chakra-ui/react"
import React, {useEffect, useState} from "react";
import axiosInstance from "../../utils/fetcher"
import { ReceiverInfo, SupplierInfo, Terms } from "../Main";
import TermsBox from "../common/TermsBox";
import {TuskerSearch} from "../common/TuskerSearch";
import {ChakraModal} from "../common/ChakraModal";
import {error, success} from "../common/popups";

interface Props {
    suppliers: SupplierInfo[]
}

interface WhitelistInput extends SupplierUpdate {
    purchaser: ReceiverInfo
}
interface WhitelistUpdateInput extends SupplierUpdate {
    purchaserId: string
}

interface SupplierUpdate {
    supplierId: string
    tenorInDays: number
    apr: number
    creditlineSize: number
}


export const AddWhitelistModal = (props: {suppliers: SupplierInfo[]} ) => {
    const [searchResults, setSearchResults] = useState([])
    const [supplierId, setSupplierId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [receiver, setReceiver] = React.useState("")
    const [newApr, setNewApr] = useState(null)
    const [newCreditLimit, setNewCreditLimit] = useState(null)
    const [newTenor, setNewTenor] = useState(null)
    const [terms, setTerms] = useState(null)
    const [close, setClose] = useState(false)
    const resetTerms = () => {
        setNewTenor(terms ? terms.tenorInDays : null)
        setNewCreditLimit(terms ? terms.creditlineSize : null)
        setNewApr(terms ? terms.apr : null)
    }
    useEffect(() => {
        const filtered_supplier = props.suppliers.filter((s) => s.id === supplierId)
        if(filtered_supplier.length) {
            setTerms(filtered_supplier[0].defaultTerms)
        }

    },[supplierId])
    useEffect(() => {
        resetTerms()
    },[terms])

    const submit = async () => {
        if(supplierId === null) {
            error("Supplier not selected")
            return
        }
        setLoading(true)
        const receiverInfo = searchResults.filter((s) => s.id === receiver)[0]
        axiosInstance.post(
            "/v1/whitelist/new",
            {
                input: {
                    supplierId: supplierId,
                    purchaser: {
                        id: receiverInfo.id,
                        name: receiverInfo.name,
                        phone: receiverInfo.phone,
                        city: receiverInfo.city,
                        terms: {
                            apr: newApr,
                            tenorInDays: newTenor,
                            creditlineSize: newCreditLimit
                        } as Terms
                    } as ReceiverInfo
                } as WhitelistInput
            })

        .then((result)=>{
            setLoading(false)
            if (result.status === 200) {
                success("Receiver has been added to whitelist!")
            }
            setReceiver("")
            setSearchResults([])
            resetTerms()
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
        <>
            <ChakraModal buttonText={"Add new"} heading={"Add new Whitelist entry"}
                         body={
                             <Box>
                                <Select onChange={(e)=> setSupplierId(e.target.value)}
                                        placeholder="Choose Supplier"
                                        value={supplierId}>
                                {props.suppliers.map((s) => (
                                    <option key={s.id} value={s.id}> {s.name} </option>
                                    ))}
                                </Select>
                                 {supplierId ?
                                <TuskerSearch
                                    submit={submit}
                                    loading={loading}
                                    receiver={receiver}
                                    setReceiver={setReceiver}
                                    searchResults={searchResults}
                                    setSearchResults={setSearchResults}
                                    newApr={terms ? terms.apr : null}
                                    setNewApr={setNewApr}
                                    newCreditLimit={terms ? terms.creditlineSize : null}
                                    setNewCreditLimit={setNewCreditLimit}
                                    newTenor={terms ? terms.tenorInDays : null}
                                    setNewTenor={setNewTenor} />  : null }
                            </Box>
                         }
                         footer={""}
                         close={close} />
        </>
    )}

export const ModTermsModal = (props: {name: string, purchaserId?: string, supplierId: string, apr: number, tenor: number,
    creditline: number}) => {
    const [newApr, setNewApr] = useState(null)
    const [newCreditLimit, setNewCreditLimit] = useState(null)
    const [newTenor, setNewTenor] = useState(null)
    const [loading, setLoading] = useState(false)
    const [close, setClose] = useState(false)


    const update = () => {
        const endpoint = props.purchaserId ? "/v1/whitelist/update" : "/v1/supplier/update"
        const input = props.purchaserId ? {
                update: {
                    supplierId: props.supplierId,
                    purchaserId: props.purchaserId,
                    apr: newApr,
                    tenorInDays: newTenor,
                    creditlineSize: newCreditLimit
                } as WhitelistUpdateInput
        } :
        {
                update: {
                    supplierId: props.supplierId,
                    apr: newApr,
                    tenorInDays: newTenor,
                    creditlineSize: newCreditLimit
                    } as SupplierUpdate
        }
        setLoading(true)
        axiosInstance.post(endpoint, input)
        .then((result)=>{
            setLoading(false)
            if (result.status === 200) {
                success("Terms have been modified!")
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
          heading={"Modify Credit Terms for " + props.name}
          body={
              <TermsBox apr={props.apr} setNewApr={setNewApr}
                        creditLimit={props.creditline}
                        setNewCreditLimit={setNewCreditLimit} tenor={props.tenor}
                        setNewTenor={setNewTenor} />
          }
          footer={
               <Button colorScheme="teal" mr={3} onClick={update}
                disabled={!(newApr || newTenor || newCreditLimit)}
                >
                    {!loading ? "Submit" : <Spinner />}
                </Button>
          }
          close={close} />
    )
}
 