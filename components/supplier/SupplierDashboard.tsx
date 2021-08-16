import {Heading, HStack} from "@chakra-ui/react"
import React from "react";
import {SupplierInfo} from "../Main";
import SupplierTable from "./SupplierTable";
import {AddSupplierModal} from "./AddSupplierModal";


interface Props {
  isLoading: boolean,
  isError: any,
  suppliers: SupplierInfo[]
}

const SupplierDashboard = ({isLoading, isError, suppliers}: Props) => {
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
