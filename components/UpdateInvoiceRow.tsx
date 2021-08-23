import {
  Box, Button, Divider, Heading, HStack, Text, VStack, Select,
  Input,
  Tooltip,

} from "@chakra-ui/react"
import React, { useEffect, useState } from "react";
import {Invoice} from "./Main"

interface Props {
    invoice: Invoice
    changeValue: React.Dispatch<React.SetStateAction<any>>,
    changeStatus: React.Dispatch<React.SetStateAction<any>>
}

const possibleStatus = ["FINANCED", "DISBURSAL_REQUESTED", "REPAID", "INITIAL"]

const UpdateInvoiceRow = ({invoice, changeStatus, changeValue}: Props) => {
    const [loanId, setLoanId] = useState("")
    const [newValue, setNewValue] = useState("")
    const [newStatus, setNewStatus] = useState("")
    
    const resetState = () => {
        setLoanId("")
        setNewValue("")
        setNewStatus("")
    }

    return (
        <>
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
                </VStack>
            </Box>
            { newStatus && (
                <Button 
                    disabled={!newStatus || (newStatus === "FINANCED" && !loanId)}
                    width="150px" 
                    onClick={() => {changeStatus(invoice.invoiceId, newStatus, loanId) ; resetState()}}
                >Change Status
                </Button>
            )}

        </>
    )
}


export default UpdateInvoiceRow