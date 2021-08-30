import {Heading, HStack} from "@chakra-ui/react"
import React from "react";
import {SupplierInfo} from "../Main";
import SupplierTable from "./SupplierTable";
import {AddSupplierModal} from "./AddSupplierModal";


interface Props {
  suppliers: SupplierInfo[]
}

const SupplierDashboard = ({suppliers}: Props) => {
  return (
      <>
      <div>
      <HStack >
          <Heading size="md">Suppliers </Heading>
        <AddSupplierModal
          />
      </HStack>
      <SupplierTable
        suppliers={suppliers}
        />

      </div>
      </>
  )
}

export default SupplierDashboard
