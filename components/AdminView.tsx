
import {
  Box, Button, Divider, Grid, Heading, HStack, Text, VStack, Spinner, Center, Select, Option,
  AlertIcon,
  AlertTitle,
  Flex,
  Progress,
  Stack,
  Form,
  Input,
  Stat,
  StatLabel,
  StatNumber,
  Tooltip,
  Wrap,

} from "@chakra-ui/react"
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axiosInstance, {fetcher} from "../utils/fetcher"
import { useForm } from "react-hook-form"
import {FinanceStatus, Invoice} from "./Main"
import {CreditLineInfo} from "./AccountInfo"
import {InvoiceDetails} from "./InvoiceDetails"
import { Currency } from "./common/Currency";

interface Props {
    invoices: Invoice[]
    creditInfo: any
}
   

const AdminView = ({invoices, creditInfo}: Props) => {
    const [newOrderValue, setNewOrderValue] = useState(2000)
    const [newValue, setNewValue] = useState("0")
    const [newStatus, setNewStatus] = useState("")
    const [newOrderReceiver, setNewOrderReceiver] = useState("")
    const [filterId, setFilterId] = useState("")

    const updateDB = async () => {
      const res = await axiosInstance.post("/v1/invoice/update")
      console.log(res.status)
      if (res.status === 200) {
          alert("Updated")
      } else {
          alert("error")
      }
    }

    const createNew = async () => {
        try {
            const res = await axiosInstance.post(`/v1/test/new/order/${newOrderReceiver}/${newOrderValue}`)
            console.log(res.status, res.data)
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
            console.log(res.status, res)
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
            console.log(res.status)
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
            console.log(res.status)
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

    // const addToWhitelist = async (locationId) => {
    //     // const msg = "" + invoiceId + "->" + newValue
    //     // alert(msg)
    //     try {
    //         const res = await axiosInstance.post("/v1/whitelist/new", {
    //             supplierId: 
    //         })
    //         console.log(res.status)
    //         if (res.status === 200) {
    //             setNewStatus("")
    //             alert("Updated")
    //         } else {
    //         alert("error")
    //         }
    //     } catch (err) {
    //         console.log(err)
    //         alert(err)
    //     }
    // }



    const filteredInvoices = () => {
        if (filterId) return invoices.filter(i => i.orderId === filterId)
        else return invoices
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
                {creditInfo && (
                    <Box>
                    <Select onChange={(e)=> setNewOrderReceiver(e.target.value)} placeholder="Select Receiver">
                        {Object.keys(creditInfo).map((c) => (
                            <option value={c}> {creditInfo[c].info.name} </option>
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
                            <Box> 
                                <Select value={newStatus} onChange={(e)=> setNewStatus(e.target.value)} placeholder={"current status: " + invoice.status}>
                                    {possibleStatus.map((s) => (
                                        <option value={s}> {s} </option>
                                        ))}
                                </Select>
                            </Box>
                            <Button width="150px" onClick={() => changeStatus(invoice.invoiceId)}>Change Status</Button>
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