
import {
  Box, Button, Divider, Heading, HStack, Text, VStack, Select,
  Input,
  Tooltip, Stack

} from "@chakra-ui/react"
import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/fetcher"
import {Invoice, SupplierInfo} from "./Main"
import {CreditSummary} from "./CreditlinesTable"
import {ConfirmInvoiceImageModal} from "./ConfirmInvoiceImageModal";
import { QuestionIcon } from "@chakra-ui/icons";
import { sign } from "crypto";

interface Props {
    invoices: Invoice[]
    creditInfo: CreditSummary
    suppliers: SupplierInfo[]
}
   

const AdminView = ({invoices, creditInfo, suppliers}: Props) => {
    const [newOrderValue, setNewOrderValue] = useState(2000)
    const [newValue, setNewValue] = useState("0")
    const [newStatus, setNewStatus] = useState("")
    const [supplier, setSupplier] = useState({id: "", name: ""})
    const [newOrderReceiver, setNewOrderReceiver] = useState("")
    const [newSignatureConfirmationResult, setNewSignatureConfirmationResult] = useState("")
    const [filterId, setFilterId] = useState("")

    const updateDB = async () => {
      const res = await axiosInstance.post("/v1/invoice/update")
      if (res.status === 200) {
          alert("Updated")
      } else {
          alert("error")
      }
    }

    const createNew = async () => {
        try {
            const res = await axiosInstance.post(`/v1/test/new/order/${supplier.id}/${newOrderReceiver}/${newOrderValue}`)
            if (res.status === 200) {
                alert(`created new order:${res.data.orderRef}`)
            } else {
                alert("error")
            }
        } catch (err) {
            console.log(err)
                alert("error")
        }
    }

    const markDelivered = async (invoiceId: string) => {
        try {

            const res = await axiosInstance.patch(`/v1/test/update/shipment/${invoiceId}`)
            if (res.status === 200) alert("marked as delivered")
        } catch (err) {
            console.log(err)
            alert('error')
        }
        // } catch (err) {
        //     console.log(err)
        //     alert(err)
        // }
    }

    const changeValue = async (invoiceId) => {
        const msg = "" + invoiceId + "->" + newValue
        // alert(msg)
        try {
            const res = await axiosInstance.post("/v1/test/update/value/"+invoiceId+"/"+newValue)
            if (res.status === 200) {
                alert("Updated")
                setNewValue("")
            } else {
            alert("error")
            }
        } catch (err) {
            console.log(err)
            alert(err)
        }
    }

    const changeStatus = async (invoiceId) => {
        const msg = "" + invoiceId + "->" + newValue
        // alert(msg)
        try {
            const res = await axiosInstance.post("/v1/test/update/status/"+invoiceId+"/"+newStatus)
            if (res.status === 200) {
                setNewStatus("")
                alert("Updated")
            } else {
            alert("error")
            }
        } catch (err) {
            console.log(err)
            alert(err)
        }
    }


    const filteredInvoices = () => {
        if (filterId) return invoices.filter(i => i.orderId === filterId)
        else return invoices
    }

    const getVerificationStatus = (invoice: Invoice) => {
        if (invoice.paymentDetails.verificationResult.includes("INVALID")) return 'invalid'
        if (invoice.paymentDetails.verificationResult.includes("VALID")) return 'valid'
        return "unverified"
    }

    const invoiceToSymbol = (invoice: Invoice) => {
        const status = getVerificationStatus(invoice)
        if (status === 'unverified') return <Tooltip label={'unverified'}>❔❔❔</Tooltip>
        if (status === 'valid') return <Tooltip label={'verified'}> ✅ </Tooltip>
        else return <Tooltip label={'verified'}> ❌ </Tooltip>
    }

    const possibleStatus = ["FINANCED", "DISBURSAL_REQUESTED", "REPAID", "INITIAL"]

    return (
        <>
        <Box>
            <VStack>
            <Heading float='left' size="sm" alignContent="left">SYNC DB</Heading>
            <Button disabled onClick={updateDB}>
                    <Tooltip label="in order to trigger status changes that happen upon delivery"> UpdateDb</Tooltip>
            </Button>
            <Divider />
            <Heading size="sm" alignContent="left">Create a New Order</Heading>
            <HStack>
                {suppliers && (
                    <Select onChange={(e)=> setSupplier(suppliers.filter(s => s.id == e.target.value)[0])} placeholder="Select Supplier">
                    { suppliers.map((s) => (
                        // eslint-disable-next-line react/jsx-key
                        <option value={s.id}> {s.name} </option>
                    ))}
                    </Select>
                )}
                {creditInfo && supplier.id && (
                    <Box>
                    <Select onChange={(e)=> setNewOrderReceiver(e.target.value)} placeholder="Select Receiver">
                        {Object.values(creditInfo[supplier.id]).map((c) => (
                            // <option value={c}> {c.info.name} </option>
                            <option value={c.info.id}> {c.info.name} ({c.info.city}, {c.info.phone}) </option>
                            ))}
                    </Select>
                    </Box>
                )}
                <Input width="300px" onChange={(e) => setNewOrderValue(parseFloat(e.target.value))} placeholder={"order value: "+newOrderValue.toString()}/>
                <Button onClick={createNew} width="150px">
                    <Tooltip label="then use order ref number to search for the invoice and reuqest it to be financed">
                        Create
                    </Tooltip>
                </Button>
            </HStack>
            <Divider />
                <Heading size="sm" alignContent="left">Change existing Invoices:</Heading>
            <HStack>
                <Input 
                width="300px" placeholder="search for order ID" onChange={(e)=>setFilterId(e.target.value)} 
                value={filterId}
                />
                <Button width="150px" onClick={()=>setFilterId("")}>Clear</Button>
            </HStack>
                <ul>
                {invoices && filteredInvoices().map((invoice: Invoice) => (
                    <li key={"inv" + invoice.invoiceId}>
                        <HStack padding="1" width="100%">
                            <Text >{invoice.orderId}     </Text>
                            {/* <Button width="290px" disabled onClick={() => markDelivered(invoice.invoiceId)}>deliver</Button> */}
                            <Input width="300px" value={newValue} placeholder={"current value: " +invoice.value} size="sm" onChange={(e) => setNewValue(e.target.value)}/>
                            <Button width="150px" onClick={() => changeValue(invoice.invoiceId)}>
                                <Tooltip label="Note that this only changes the value in the arboreum DB and not in the Tusker data">
                                Change Value
                                </Tooltip>
                            </Button>
                            <Stack direction='row'>
                                <Text> <Tooltip label="The uploaded image must match the invoice id and the invoice must be signed!">
                                        <Text fontSize="lg"> Verification Status: {invoiceToSymbol(invoice)} </Text>
                                    </Tooltip>
                                </Text>
                                <ConfirmInvoiceImageModal invoice={invoice} />
                            </Stack>
                            <Box> 
                                <Select value={newStatus} onChange={(e)=> setNewStatus(e.target.value)} placeholder={"current status: " + invoice.status}>
                                    {possibleStatus.map((s) => (
                                        <option value={s}> {s} </option>
                                        ))}
                                </Select>
                            </Box>
                            <Button 
                            width="150px" onClick={() => changeStatus(invoice.invoiceId)}
                            disabled={!newStatus || (newStatus=='FINANCED' && getVerificationStatus(invoice) !== 'valid' )}
                            >
                                Update Status
                            </Button>
                        </HStack>
                    </li>
                    ))
                }
                </ul>
            </VStack>

        </Box>
        </>
    )
}

export default AdminView