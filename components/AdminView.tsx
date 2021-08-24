
import {
  Box, Button, Divider, Heading, HStack, Text, VStack, Select,
  Input,
  Tooltip,

} from "@chakra-ui/react"
import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/fetcher"
import {Invoice, SupplierInfo} from "./Main"
import {CreditSummary} from "./CreditlinesTable"
import UpdateInvoiceRow from "./UpdateInvoiceRow"

interface Props {
    invoices: Invoice[]
    creditInfo: CreditSummary
    suppliers: SupplierInfo[]
}
   

const AdminView = ({invoices, creditInfo, suppliers}: Props) => {
    const [newOrderValue, setNewOrderValue] = useState(2000)
    const [supplier, setSupplier] = useState({id: "", name: ""})
    const [newOrderReceiver, setNewOrderReceiver] = useState("")
    const [orderRefFilter, setOrderRefFilter] = useState("")
    const [loanIdFilter, setLoanIdFilter] = useState("")

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

    const changeValue = async (invoiceId, newValue) => {
        // const msg = "" + invoiceId + "->" + newValue
        // alert(msg)
        try {
            const res = await axiosInstance.post("/v1/admin/update", {update: {invoiceId, newValue}})
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

    const changeStatus = async (invoiceId, newStatus, loanId = "", txId = "") => {
        try {
            const res = await axiosInstance.post("/v1/admin/update", {update: { invoiceId, txId, loanId, newStatus }})
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
        if (loanIdFilter || orderRefFilter) {
            return invoices.filter(
                i => orderRefFilter ? i.orderId === orderRefFilter : true).filter(
                    i => loanIdFilter ? i.paymentDetails.loanId === loanIdFilter : true)
        }
        else return invoices
    }

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
                            <option key={c} value={c.info.id}> {c.info.name} ({c.info.city}, {c.info.phone}) </option>
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
                    width="300px" placeholder="search for a specific order ref no" onChange={(e)=>setOrderRefFilter(e.target.value)} 
                    value={orderRefFilter}
                />
                <Input 
                    width="300px" placeholder="filter by loanID" onChange={(e)=>setLoanIdFilter(e.target.value)} 
                    value={loanIdFilter}
                />
                <Button width="150px" onClick={()=>{setOrderRefFilter(""), setLoanIdFilter("")}}>Clear</Button>
            </HStack>
                <ul>
                {invoices && filteredInvoices().map((invoice: Invoice) => (
                    <li key={"inv" + invoice.invoiceId}>
                        <HStack padding="1" width="100%">
                            <UpdateInvoiceRow changeStatus={changeStatus} changeValue={changeValue} invoice={invoice} />
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