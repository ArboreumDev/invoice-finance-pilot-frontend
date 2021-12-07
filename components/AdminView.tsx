
import {
  Box, Button, Divider, Heading, HStack, Text, VStack, Select,
  Input, useClipboard, Link,
  Tooltip, Spinner
} from "@chakra-ui/react"
import { ExternalLinkIcon } from "@chakra-ui/icons"
import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/fetcher"
import {Invoice, SupplierInfo} from "./Main"
import {CreditSummary} from "./CreditlinesTable"
import UpdateInvoiceRow from "./UpdateInvoiceRow"
import CsvDownloader from "react-csv-downloader";

const possibleStatus = ["DELIVERED", "DISBURSAL_REQUESTED", "PLACED_AND_VALID", "REPAID", "INITIAL", "FINANCED"]
const algoExplorerBaseUrl = "https://testnet.algoexplorer.io/tx/"

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
    const [statusFilter, setStatusFilter] = useState("")
    const [supplierFilter, setSupplierFilter] = useState("")
    const [lastUpdate, setLastUpdate] = useState("")
    const [filterId, setFilterId] = useState("")
    const [ isLoading, setIsLoading ] = useState(false)
    const [csvExport, setCsvExport] = useState("")
    const { hasCopied, onCopy } = useClipboard(csvExport)

  useEffect(() => {
    const r = window.localStorage.getItem("arboreum:last_update")
    if (r) setLastUpdate(r)
    }, [])
 

    const updateDB = async () => {
      const res = await axiosInstance.post("/v1/invoice/update")
      if (res.status === 200) {
        alert("Updated.\n (It may take a few seconds until the change becomes visible.)")
        const now = new Date(Date.now())
        const nowString = now.toLocaleDateString('en-US') + " " + now.toLocaleTimeString('en-US')
        setLastUpdate(nowString)
        window.localStorage.setItem("arboreum:last_update", nowString)
      } else {
        alert("error")
      }
    }

    const createNewOrder = async () => {
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

    const tokenizeAsset = async () => {
        try {
            setIsLoading(true)

            const res = await axiosInstance.post(`/v1/admin/asset/new/${loanIdFilter}`)
            if (res.status === 200) {
                alert(`Success: created new asset with id: ${res.data.assetId}: \n
                    view asset at: ${algoExplorerBaseUrl}${res.data.assetId} \n
                    view tx at: ${algoExplorerBaseUrl}${res.data.txId}`
                )
                setIsLoading(false)
            } else {
                setIsLoading(false)
                alert(`ERROR: ${res.data}`)
            }
        } catch (err) {
            setIsLoading(false)
            console.log('sdfsdfsdfsdf', err?.response)
            alert(`ERROR: ${err?.response?.data?.detail}`)
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
    }

    const changeValue = async (invoiceId, newValue) => {
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

    const changeStatus = async (invoiceId, newStatus, loanId = "", txId = "", disbursalDate = "") => {
        try {
            const res = await axiosInstance.post("/v1/admin/update", {update: { invoiceId, txId, loanId, newStatus, disbursalDate }})
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


    const filteredInvoices = () => {
        if (loanIdFilter || orderRefFilter || statusFilter || supplierFilter) {
            return invoices.filter(
                i => orderRefFilter ? i.orderId === orderRefFilter : true).filter(
                    i => statusFilter ? i.shippingStatus === statusFilter || i.status === statusFilter : true).filter(
                        i => loanIdFilter ? i.paymentDetails.loanId === loanIdFilter : true).filter(
                            i => supplierFilter ? i.supplierId === supplierFilter : true
                        )
        }
        else return invoices
    }

    const invoicesToBeFinanced = (supplierId: string) => {
        return invoices.filter( i => i.supplierId === supplierId).filter((i: Invoice) => {
            return  (
                i.verified  // by tusker
                && i.shippingStatus === "DELIVERED" 
                && i.paymentDetails?.signatureVerificationResult?.includes("VALID")  // signature on invoice image
                && i.status == "INITIAL"
            )
        })
    }

    const prepareCsvExport = () => {
        const rows = []
        for (const supplier of suppliers) {
            let totalValue = 0
            let totalPrincipal = 0
            for (const invoice of invoicesToBeFinanced(supplier.id)) {
                rows.push({
                    supplier: supplier.name,
                    orderId: invoice.orderId,
                    invoiceValue: invoice.value,
                    principal: invoice.paymentDetails.principal
                })
                totalValue += invoice.value
                totalPrincipal += invoice.paymentDetails.principal
            }
            rows.push({
                supplier: supplier.name,
                orderId: "Total",
                invoiceValue: totalValue,
                principal: totalPrincipal,
            })
        }
        return Promise.resolve(rows);
    }; 

    return (
        <>
        <Box>
            <VStack>
            <Button onClick={updateDB}>
                    <Tooltip label="update delivery status by syncing DB with latest Tusker data"> UpdateDb</Tooltip>
            </Button>
            <Text> (last update: {lastUpdate}) </Text>
            <HStack>
                <Text>Get latest financable invoices:</Text>
                <Box>
                    <CsvDownloader filename={`exportAfterUpdate${lastUpdate}.csv`} datas={prepareCsvExport}>
                        <Button>Download .csv</Button>
                    </CsvDownloader>
                </Box>
            </HStack>

            <Divider />
            <Heading size="md" alignContent="left">Create a New Order (Demo only)</Heading>
            <HStack>
                {suppliers && (
                    <Select onChange={(e)=> setSupplier(suppliers.filter(s => s.id == e.target.value)[0])} placeholder="Select Supplier">
                    { suppliers.map((s) => (
                        <option key={s.id} value={s.id}> {s.name} </option>
                    ))}
                    </Select>
                )}
                {creditInfo && supplier.id && (
                    <Box>
                    <Select onChange={(e)=> setNewOrderReceiver(e.target.value)} placeholder="Select Receiver">
                        {Object.values(creditInfo[supplier.id]).map((c) => (
                            <option key={c.info.id} value={c.info.id}> {c.info.name} ({c.info.city}, {c.info.phone}) </option>
                            ))}
                    </Select>
                    </Box>
                )}
                <Input width="300px" onChange={(e) => setNewOrderValue(parseFloat(e.target.value))} placeholder={"order value: "+newOrderValue.toString()}/>
                <Button onClick={createNewOrder} width="150px">
                    <Tooltip label="then use order ref number to search for the invoice and reuqest it to be financed">
                        Create
                    </Tooltip>
                </Button>
            </HStack>
            <Divider />
            <Heading size="md" alignContent="left">Change View</Heading>
                <HStack>
                    <Heading size="sm" alignContent="left">Filter:</Heading>
                    <Select 
                    width="300px"
                    value={supplierFilter} 
                    onChange={(e)=> {setSupplierFilter(e.target.value)}}
                    placeholder={"filter by supplier"}>
                        {suppliers.map((s) => (
                            <option key={s.id} value={s.id}> {s.name} </option>
                            ))}
                    </Select>
                    <Select 
                    width="300px"
                    value={statusFilter} 
                    onChange={(e)=> {setStatusFilter(e.target.value)}}
                    placeholder={"filter by shipping/finance status"}>
                        {possibleStatus.map((s) => (
                            <option key={s} value={s}> {s} </option>
                            ))}
                    </Select>
                </HStack>
            <HStack>
                <Heading size="sm" alignContent="left">Search for:</Heading>
                <Input 
                    width="300px" placeholder="a specific order ref no: <100454>" onChange={(e)=>setOrderRefFilter(e.target.value)} 
                    value={orderRefFilter}
                />
                <Input 
                    width="300px" placeholder="all loans with a specific loanID: <l1> " onChange={(e)=>setLoanIdFilter(e.target.value)} 
                    value={loanIdFilter}
                />
           </HStack>
            <HStack>
                <Heading size="sm" alignContent="left">Actions:</Heading>
               <Button width="150px" onClick={()=>{setOrderRefFilter(""), setLoanIdFilter(""), setStatusFilter(""), setSupplierFilter("")}}>Clear search/filter</Button>
                <Button onClick={tokenizeAsset} width="150px" disabled={!loanIdFilter}>
                    {isLoading ? 
                    <Spinner /> 
                    : <Tooltip label="create a token with data of all loans of the same loanId as metadata (Note: enter a loan-ID in search field to get started)">
                        Tokenize
                    </Tooltip>
                    }
                </Button>
 
            </HStack>
                <ul>
                {invoices && filteredInvoices().map((invoice: Invoice) => (
                    <li key={"inv" + invoice.invoiceId}>
                        <HStack padding="1" width="100%">
                            <UpdateInvoiceRow 
                            changeStatus={changeStatus} changeValue={changeValue} invoice={invoice} markDelivered={markDelivered}
                            />
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