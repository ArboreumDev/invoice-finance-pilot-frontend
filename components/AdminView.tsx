
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
    const [newValue, setNewValue] = useState("0")
    const [newStatus, setNewStatus] = useState("")
    const [newOrderReceiver, setNewOrderReceiver] = useState("")

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
            const res = await axiosInstance.post(`/v1/test/new/order/${newOrderReceiver}`)
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
                alert("Updated")
            } else {
            alert("error")
            }
        } catch (err) {
            console.log(err)
            alert(err)
        }
    }

    const possibleStatus = ["FINANCED", "DISBURSAL_REQUESTED", "REPAID", "INITIAL"]

    return (
        <>
        <Box>
            <VStack>
            <Button disabled onClick={updateDB}>
                    <Tooltip label="in order to trigger status changes that happen upon delivery"> UpdateDb</Tooltip>
            </Button>
            <HStack>

            {creditInfo && (
                <Select onChange={(e)=> setNewOrderReceiver(e.target.value)} placeholder="Select Receiver">
                {Object.keys(creditInfo).map((c) => (
                    <option value={c}> {creditInfo[c].info.name} </option>
                ))}
                </Select>
                )}
            <Button onClick={createNew}>
                <Tooltip label="then use order ref number to search for the invoice and reuqest it to be financed">
                    Create New Order
                </Tooltip>
            </Button>
            </HStack>
                <ul>
                {invoices && invoices.map((invoice: Invoice) => (
                    <li key={"inv" + invoice.invoiceId}>
                        <HStack padding="1" width="100%">
                            <Text >{invoice.orderId}     </Text>
                            <Button disabled onClick={() => markDelivered(invoice.invoiceId)}>deliver</Button>
                                <Input placeholder={"current value: " +invoice.value} size="sm" onChange={(e) => setNewValue(e.target.value)}/>
                            <Button onClick={() => changeValue(invoice.invoiceId)}>Change Value</Button>
                                <Select onChange={(e)=> setNewStatus(e.target.value)} placeholder={"current status: " + invoice.status}>
                                {possibleStatus.map((s) => (
                                    <option value={s}> {s} </option>
                                ))}
                                </Select>
                            <Button onClick={() => changeStatus(invoice.invoiceId)}>Change Status</Button>
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