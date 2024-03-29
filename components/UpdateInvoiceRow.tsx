import {
  Box, Button, Divider, Heading, HStack, Text, VStack, Select, Stack,
  Input,
  Tooltip,

} from "@chakra-ui/react"
import React, { useEffect, useState } from "react";
import {Invoice, ShipmentStatus} from "./Main"
import {ConfirmInvoiceImageModal} from "./ConfirmInvoiceImageModal";
import { QuestionIcon } from "@chakra-ui/icons";


interface Props {
    invoice: Invoice
    changeValue: any
    changeStatus: any
    markDelivered: any
}

const possibleStatus = ["FINANCED", "DISBURSAL_REQUESTED", "REPAID", "INITIAL"]
const moneyStates = ["FINANCED", "REPAID"]

const UpdateInvoiceRow = ({invoice, changeStatus, changeValue, markDelivered}: Props) => {
    const [loanId, setLoanId] = useState("")
    const [disbursalDate, setDisbursalDate] = useState("")
    const [txId, setTxId] = useState("")
    const [newValue, setNewValue] = useState("")
    const [newStatus, setNewStatus] = useState("")
    const [newSignatureConfirmationResult, setNewSignatureConfirmationResult] = useState("")

    const getVerificationStatus = (invoice: Invoice) => {
        if (invoice.paymentDetails.signatureVerificationResult.includes("INVALID")) return 'invalid'
        if (invoice.paymentDetails.signatureVerificationResult.includes("VALID")) return 'valid'
        return "unverified"
    }

    const invoiceToSymbol = (invoice: Invoice) => {
        const status = getVerificationStatus(invoice)
        if (status === 'unverified') return <Tooltip label={'unverified'}>❔❔❔</Tooltip>
        if (status === 'valid') return <Tooltip label={'verified'}> ✅ </Tooltip>
        else return <Tooltip label={'verified'}> ❌ </Tooltip>
    }
    
    const resetState = () => {
        setLoanId("")
        setTxId("")
        setNewValue("")
        setNewStatus("")
        setDisbursalDate("")
        setNewSignatureConfirmationResult("")
    }

    /**
     * prevent incomplete updates
     */
    const allowStatusUpdate = () => {
        console.log('nn', !newStatus)
        if (!newStatus) return false
        if (newStatus == 'FINANCED' && loanId && txId && getVerificationStatus(invoice) && disbursalDate) return true
        if (newStatus == 'REPAID' && txId) return true
        return newStatus == "INITIAL";

    }
    // console.log('i', invoice)

    return (
        <>
            <Text>{invoice.orderId}</Text>
            <Text>({invoice.paymentDetails.loanId})</Text>
            <Input 
                width="300px" 
                value={newValue}
                placeholder={"current value: " +invoice.value}
                disabled /*comment out for testing or development*/ 
                size="sm"
                onChange={(e) => setNewValue(e.target.value)}
            />
            {newValue && (
                <Button 
                    width="150px"
                    // disabled /*comment out for testing or development*/ 
                    onClick={() => {changeValue(invoice.invoiceId, newValue); resetState()}}
                >
                    <Tooltip label="Note that this only changes the value in the arboreum DB and not in the Tusker data">
                    Change Value
                    </Tooltip>
                </Button>
            )}
            {invoice.shippingStatus===ShipmentStatus.DELIVERED ? 
            <Text>{invoice.shippingStatus}</Text>
            : (
                <Button 
                    width="150px"
                    onClick={() => {markDelivered(invoice.invoiceId)}}
                    disabled
                    // disabled={invoice.shippingStatus===ShipmentStatus.DELIVERED} /*comment out for testing or development*/ 
                    >
                    <Tooltip label="For testing purposes, this will trigger the same changes as DELIVERED came by the regular update-route">
                    Mark Delivered
                    </Tooltip>
                </Button>
            )}
            <Box> 
                <Stack direction='row'>
                    <Tooltip label="The uploaded image must match the invoice id and the invoice must be signed!">
                        <Text fontSize="lg"> Invoice signed: {invoiceToSymbol(invoice)} </Text>
                    </Tooltip>
                    <ConfirmInvoiceImageModal invoice={invoice} />
                <VStack>
                    <Select 
                    value={newStatus} 
                    onChange={(e)=> {setNewStatus(e.target.value)}}
                    placeholder={"current status: " + invoice.status}>
                        {possibleStatus.map((s) => (
                            <option key={s} value={s}> {s} </option>
                            ))}
                    </Select>
                        { newStatus == "FINANCED" && (
                            <>
                                <Input width="300px" value={loanId} placeholder={"enter liquiloans loan ID "} size="sm" onChange={(e) => setLoanId(e.target.value)}/>
                                <Input type="datetime-local"  width="300px" value={disbursalDate} placeholder={"disbursal date: e.g. '2021-09-24T16:03:13.588402+02:00'"} size="sm" onChange={(e) => setDisbursalDate(e.target.value)}/>
                            </>
                        )}
                        { moneyStates.includes(newStatus) && (
                            <>
                                <Input width="300px" value={txId} placeholder={"enter transaction ID "} size="sm" onChange={(e) => setTxId(e.target.value)}/>
                            </>
                        )}
    
                </VStack>
                </Stack>
            </Box>
            { newStatus && (
                <Button 
                    disabled={!allowStatusUpdate()}
                    width="150px" 
                    onClick={() => {changeStatus(invoice.invoiceId, newStatus, loanId, txId, disbursalDate) ; resetState()}}
                >Change Status
                </Button>
            )}
            {(
                invoice.paymentDetails.tokenization?.asset_id ?
                <Text>Tokenized</Text>
                : <Text></Text>
            )}

        </>
    )
}


export default UpdateInvoiceRow