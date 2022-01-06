import {Heading, HStack} from "@chakra-ui/react"
import React from "react";
import {PurchaserInfo} from "../Main";
import PurchaserTable from "./PurchaserTable";


interface Props {
  purchasers: PurchaserInfo[]
}

const PurchaserDashboard = ({purchasers}: Props) => {
  return (
      <>
      <div>
      <HStack >
          <Heading size="md">Purchasers </Heading>
        {/* <AddPurchaserModal /> */}
      </HStack>
      <PurchaserTable
        purchasers={purchasers}
      />

      </div>
      </>
  )
}

export default PurchaserDashboard
