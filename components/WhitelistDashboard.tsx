import {Select,Spacer, Flex, Box, Button, Center, Divider, Grid, Heading, HStack, Text, VStack} from "@chakra-ui/react"
import {Line} from 'react-chartjs-2';
import useSWR from 'swr'
import AmountInput from "./AmountInput"
import AddInvoiceDrawer from "./AddInvoiceDrawer"
import {Invoice} from "./Main"
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axiosInstance, {fetcher} from "../utils/fetcher"
import { useForm } from "react-hook-form"
import {FinanceStatus} from "./Main"
import {InvoiceDetails} from "./InvoiceDetails"
import InvoiceTable from "./InvoiceTable"
import CreditLineInfo from "./CreditlinesTable"
import { Currency } from "./common/Currency";
import WhitelistTable from "./WhitelistTable"
import {AddWhitelistModal} from "./AddWhitelistModal"


interface Props {
  isLoading: boolean,
  isError: any
  creditInfo: any
  supplier: string
}

const WhitelistDashboard = ({isLoading, isError, creditInfo, supplier}: Props) => {
  if (isLoading) {
    return <Heading as="h2" size="lg" fontWeight="400" color="gray.500">
        Loading
      </Heading>
  }
  if (isError) {
    console.log(isError)
    return <Heading as="h2" size="lg" fontWeight="400" color="gray.500">
        There was an error
      </Heading>
  }
  return (
      <>
      <div>
      <HStack >
          <Heading size="md">Whitelist for Supplier {supplier}</Heading>
        <AddWhitelistModal 
          supplier={supplier}
          />
      </HStack>
      <WhitelistTable 
        whitelist={creditInfo}
        supplier={supplier}
        />

      </div>
      </>
  )
}

export default WhitelistDashboard
