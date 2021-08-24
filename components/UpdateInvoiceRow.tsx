import {
  Box, Button, Divider, Heading, HStack, Text, VStack, Select,
  Input,
  Tooltip,

} from "@chakra-ui/react"
import React, { useEffect, useState } from "react";
import {Invoice} from "./Main"


interface Props {
    invoice: Invoice
    changeValue: any
    changeStatus: any
}

const possibleStatus = ["FINANCED", "DISBURSAL_REQUESTED", "REPAID", "INITIAL"]
const moneyStates = ["FINANCED", "REPAID"]

const UpdateInvoiceRow = ({invoice, changeStatus, changeValue}: Props) => {
    const [loanId, setLoanId] = useState("")
    const [txId, setTxId] = useState("")
    const [newValue, setNewValue] = useState("")
    const [newStatus, setNewStatus] = useState("")
    
    const resetState = () => {
        setLoanId("")
        setTxId("")
        setNewValue("")
        setNewStatus("")
    }

    /**
     * prevent incomplete updates
     */
    const allowStatusUpdate = () => {
        console.log('nn', !newStatus)
        if (!newStatus) return false
        if (newStatus == 'FINANCED' && loanId && txId) return true
        if (newStatus == 'REPAID' && txId) return true
        if (newStatus == "INITIAL") return true
        return false
    }

    return (
        <>
            <Text>{invoice.orderId}</Text>
            <Text>({invoice.paymentDetails.loanId})</Text>
            <Input 
                width="300px" 
                value={newValue}
                placeholder={"current value: " +invoice.value}
                size="sm"
                onChange={(e) => setNewValue(e.target.value)}
            />
            {newValue && (
                <Button 
                    width="150px"
                    onClick={() => {changeValue(invoice.invoiceId, newValue); resetState()}}
                >
                    <Tooltip label="Note that this only changes the value in the arboreum DB and not in the Tusker data">
                    Change Value
                    </Tooltip>
                </Button>
            )}
            <Box> 
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
                        </>
                    )}
                    { moneyStates.includes(newStatus) && (
                        <>
                            <Input width="300px" value={txId} placeholder={"enter transaction ID "} size="sm" onChange={(e) => setTxId(e.target.value)}/>
                        </>
                    )}
 
                </VStack>
            </Box>
            { newStatus && (
                <Button 
                    disabled={!allowStatusUpdate()}
                    width="150px" 
                    onClick={() => {changeStatus(invoice.invoiceId, newStatus, loanId, txId) ; resetState()}}
                >Change Status
                </Button>
            )}

        </>
    )
}


export default UpdateInvoiceRow