import {Heading, HStack} from "@chakra-ui/react"
import {SupplierInfo} from "../Main"
import React from "react";
import {CreditSummary} from "../CreditlinesTable"
import WhitelistTable from "./WhitelistTable"
import {AddWhitelistModal} from "./AddWhitelistModal"


interface Props {
  creditInfo: CreditSummary
  suppliers: SupplierInfo[]
}

const WhitelistDashboard = ({creditInfo, suppliers}: Props) => {
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
