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
import CreditlineIdBox from "../supplier/CreditlineIdBox";


interface WhitelistInput extends SupplierUpdateInput {
    purchaser: ReceiverInfo
}
interface WhitelistUpdateInput extends SupplierUpdateInput {
    purchaserId: string
    creditlineSize: number
}

interface SupplierUpdateInput {
    supplierId: string
    tenorInDays: number
    apr: number
    creditlineId: number
}


export const AddWhitelistModal = (props: {suppliers: SupplierInfo[]} ) => {
    const [searchResults, setSearchResults] = useState([])
    const [supplierId, setSupplierId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [receiver, setReceiver] = React.useState("")
    const [newApr, setNewApr] = useState(null)
    const [newCreditLimit, setNewCreditLimit] = useState(null)
    const [newTenor, setNewTenor] = useState(null)
    const [defaultTerms, setDefaultTerms] = useState(null)
    const [close, setClose] = useState(false)
    const resetTerms = () => {
        setNewTenor(defaultTerms ? defaultTerms.tenorInDays : null)
        setNewCreditLimit(defaultTerms ? defaultTerms.creditlineSize : null)
        setNewApr(defaultTerms ? defaultTerms.apr : null)
    }
    useEffect(() => {
        const filtered_supplier = props.suppliers.filter((s) => s.id === supplierId)
        if(filtered_supplier.length) {
            setDefaultTerms(filtered_supplier[0].defaultTerms)
        }

    },[supplierId])
    useEffect(() => {
        resetTerms()
    },[defaultTerms])

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
                                    defaultApr={defaultTerms ? defaultTerms.apr : null}
                                    newApr={newApr}
                                    setNewApr={setNewApr}
                                    defaultCreditLimit={0}
                                    newCreditLimit={newCreditLimit}
                                    setNewCreditLimit={setNewCreditLimit}
                                    defaultTenor={defaultTerms ? defaultTerms.tenorInDays : null}
                                    newTenor={newTenor}
                                    setNewTenor={setNewTenor} />  : null }
                            </Box>
                         }
                         footer={""}
                         close={close} />
        </>
    )}

export const ModTermsModal = (props: {
    name: string, purchaserId?: string, supplierId: string, apr: number, tenor: number,
    creditline: number, creditlineId?: string 
}) => {
    const [newApr, setNewApr] = useState(null)
    const [newCreditLimit, setNewCreditLimit] = useState(null)
    const [newCreditlineId, setNewCreditlineId] = useState(null)
    const [newTenor, setNewTenor] = useState(null)
    const [loading, setLoading] = useState(false)
    const [close, setClose] = useState(false)


    const update = () => {
        const isWhitelistUpdate = props.purchaserId
        const endpoint = isWhitelistUpdate ? "/v1/whitelist/update" : "/v1/supplier/update"
        let params
        if (isWhitelistUpdate) {
            params = {
                supplierId: props.supplierId,
                purchaserId: props.purchaserId,
                apr: newApr !== null ? newApr : props.apr,
                tenorInDays: newTenor ? newTenor : props.tenor,
                creditlineSize: newCreditLimit !== null ? newCreditLimit : props.creditline
            } as WhitelistUpdateInput
        } else {
            params = {
                supplierId: props.supplierId,
                apr: newApr !== null ? newApr : props.apr,
                tenorInDays: newTenor ? newTenor : props.tenor,
                creditlineSize: newCreditLimit !== null ? newCreditLimit : props.creditline,
                creditlineId: newCreditlineId
            } as SupplierUpdateInput
            if (newCreditlineId) {
                params.creditlineId = newCreditlineId
            }
        }        
        setLoading(true)
        console.log('up', params)
        axiosInstance.post(endpoint, {update: params})
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
                <>
                    <TermsBox 
                        defaultApr={props.apr} setNewApr={setNewApr}
                        defaultCreditLimit={props.creditline}
                        setNewCreditLimit={setNewCreditLimit} defaultTenor={props.tenor}
                        setNewTenor={setNewTenor} 
                    />
                    {/* if this is for the supplier, also allow updating the supplierCreditlineID */}
                    {!props.purchaserId && (
                        <CreditlineIdBox 
                            currentCreditlineId={newCreditlineId}
                            setCreditlineID={setNewCreditlineId}
                        />
                    )}
                </>
          }
          footer={
               <Button colorScheme="teal" mr={3} onClick={update}
                disabled={!(newApr || newTenor || newCreditLimit || (!props.purchaserId && newCreditlineId))}
                >
                    {!loading ? "Submit" : <Spinner />}
                </Button>
          }
          close={close} />
    )
}
 