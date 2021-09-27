import {Select,Spacer, Flex, Box, Button, Center, Divider, Grid, Heading, HStack, Text, VStack} from "@chakra-ui/react"
import AddInvoiceDrawer from "./AddInvoiceDrawer"
import {Invoice, ReceiverInfo} from "./Main"
import React, { useEffect, useState } from "react";
import {FinanceStatus, SupplierInfo} from "./Main"
import InvoiceTable from "./InvoiceTable"
import SupplierTable from "./supplier/SupplierTable";
import {CreditLineInfo} from "./CreditlinesTable";
import {flattenObject} from "../utils/utils"
import CsvDownloader from "react-csv-downloader";


interface Props {
  invoices: Invoice[],
  creditInfo: any
  suppliers: SupplierInfo[]

}

const LenderDashboard = ({invoices, creditInfo, suppliers}: Props) => {

  const [receiverId, setReceiver] = useState("")
  const [supplierId, setSupplier] = useState("")
  const [loanId, setLoanId] = useState("")
  const [invoiceStatus, setInvoiceStatus] = useState("")
  // const [invoicesToShow, setInvoicesToShow] = useState(invoices)

  const filteredInvoices = () => {
      return invoices 
      .filter( i => supplierId ? i.supplierId === supplierId : true)
      .filter( i => receiverId ? i.receiverInfo.id === receiverId : true)
      .filter(i => invoiceStatus ? i.status === invoiceStatus : true)
      .filter(i => loanId ? i.paymentDetails.loanId === loanId : true)

    } 

  const onInvest = () => {
    // invest in loan
  }  

  const showDetails = (invoiceId) => {
    const inv = invoices.filter(i => i.invoiceId === invoiceId)
    const msg = "TODO format this: " + JSON.stringify(inv)
    alert(msg)
  }
  
  const chart_options = {
    maintainAspectRatio: false
  }

  const supplierMap = suppliers.reduce((obj, item: SupplierInfo) => {
    return {
      ...obj,
      [item.id]: item.name
    }
  }, {})



  const filteredReceiversCreditInfo = () => {
    if (supplierId) {
      return Object.values(creditInfo[supplierId]).map((c: CreditLineInfo)=>c.info)
    } 
    else {
      let ret = {}
      for (const supplier in creditInfo) {
        if (supplier !== "tusker") {
            Object.assign(ret, Object.fromEntries(Object.values(creditInfo[supplier])
                                                        .map((creditInfo: CreditLineInfo) => [creditInfo.info.id, creditInfo.info])))
        }
      }
      return Object.values(ret)
    }
  }

  const allLoanIds = Array.from(new Set(invoices.map(i => i.paymentDetails.loanId)))

  const prepareCsvExport = () => {
      const rows = []
      filteredInvoices().forEach(invoice => {
        rows.push(flattenObject(invoice))
      });
      return Promise.resolve(rows);
  }; 

  return (
    <>
    <VStack>
    <HStack >
      <Text minW="110px" width="27%">Show Invoices:</Text>
      <Select onChange={(e)=> setInvoiceStatus(e.target.value)} placeholder="All Status">
        <option value={FinanceStatus.INITIAL}>requested & awaiting delivery (INITIAL)</option>
        <option value={FinanceStatus.DISBURSAL_REQUESTED}>delivered & awaiting disbursal (DISBURSAL_REQUESTED)</option>
        <option value={FinanceStatus.FINANCED}>disbursed & to be paid back (FINANCED)</option>
      </Select>
      {suppliers && (
        <Select onChange={(e)=> setSupplier(e.target.value)} placeholder="All Suppliers">
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}> {s.name} </option>
            ))}
        </Select>
      )}
      {creditInfo && (
        <Select onChange={(e)=> setReceiver(e.target.value)} placeholder="All Receivers">
          { filteredReceiversCreditInfo().map((c: ReceiverInfo) => (
            <option key={c.id} value={c.id}> {c.name} ({c.city}) </option>
          ))}
        </Select>
      )}
      {allLoanIds && (
      <Select onChange={(e)=> setLoanId(e.target.value)} placeholder="All Loan Ids">
        {allLoanIds.map((l) => (
          <option key={l} value={l}> {l} </option>
        ))}
      </Select>
      )}
        <Box minW="170px" width="10%">
          <AddInvoiceDrawer />
        </Box>
          <CsvDownloader filename={`filteredInvoices${Date.now()}.csv`} datas={prepareCsvExport}>
              <Button title="Download a .csv file of all currently showed invoices">Export</Button>
          </CsvDownloader>
      </HStack>
      <Divider />
      <HStack width="100%">
        <Center width="100%">
          <Box minW="xl" width="100%">
          <InvoiceTable 
            invoices={ filteredInvoices().sort((a,b) => {return parseInt(b.orderId) - parseInt(a.orderId);})} 
            supplierMap={ suppliers.reduce(
              (obj, supplier: SupplierInfo) => { return { ...obj, [supplier.id]: supplier.name } }
              , {})}
            />
        </Box>
        </Center>
      </HStack>
    </VStack>
    </>
  )
}

export default LenderDashboard
