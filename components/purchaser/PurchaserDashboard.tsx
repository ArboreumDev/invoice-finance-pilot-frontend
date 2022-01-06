import {Heading, HStack, Button, Tooltip} from "@chakra-ui/react"
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
        <Button disabled title="">
          <Tooltip label="Adding Purchaser without a supplier is not allowed! Go to the Whitelist-Tab and add a new purchaser-supplier pair. Then you can come back here and edit the purchaser limit.">
          Add new
          </Tooltip>
          </Button>
      </HStack>
      <PurchaserTable
        purchasers={purchasers}
      />

      </div>
      </>
  )
}

export default PurchaserDashboard
