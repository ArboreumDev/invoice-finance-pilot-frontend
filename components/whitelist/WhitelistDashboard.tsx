import {Heading, HStack} from "@chakra-ui/react"
import {SupplierInfo} from "../Main"
import React from "react";
import {CreditSummary} from "../CreditlinesTable"
import WhitelistTable from "./WhitelistTable"
import {AddWhitelistModal} from "./AddWhitelistModal"


interface Props {
  isLoading: boolean,
  isError: any
  creditInfo: CreditSummary
  suppliers: SupplierInfo[]
}

const WhitelistDashboard = ({isLoading, isError, creditInfo, suppliers}: Props) => {
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
          <Heading size="md">Whitelist for Supplier </Heading>
        <AddWhitelistModal 
          suppliers={suppliers}
          />
      </HStack>
      <WhitelistTable 
        creditInfo={creditInfo}
        suppliers={suppliers}
        />

      </div>
      </>
  )
}

export default WhitelistDashboard
