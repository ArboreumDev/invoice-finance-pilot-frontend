import { Stack, Box, Heading, Center, Table, Thead, Tbody, Tr, Th, Td, chakra } from "@chakra-ui/react"
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"
import { useTable, useSortBy, useFilters} from "react-table"
import {Invoice} from "./Main"
import React, { useMemo, useEffect, useState } from "react";
import {InvoiceDetails} from "./InvoiceDetails"


export interface SupplierMap { [key: string]: string; }
interface Props {
  invoices: Invoice[]
  supplierMap: SupplierMap
}
 

const InvoiceTable = (props: Props) => {

  const currencyToString = (amount) => {
    return amount.toLocaleString("en-IN", { 
        style: "currency",
        currency: "INR" ,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })
    }
 

  const data = React.useMemo(
    () => props.invoices.map((i: Invoice) => {
        return {
            ...i,
          amount: currencyToString(i.value),
          supplierName: props.supplierMap[i.supplierId],
          details: <InvoiceDetails invoice={i}/>,
          shortDate: i.paymentDetails.collectionDate ? i.paymentDetails.collectionDate.slice(0,10) : ""
        }
      }),
    [props.invoices, ]
  )

  const columns = React.useMemo(
    () => [
      {
        Header: "Order Id",
        accessor: "orderId",
      },
      {
        Header: "Receiver",
        accessor: "receiverInfo.name",
      },
      {
        Header: "Supplier",
        accessor: "supplierName",
      },
      {
        Header: "Invoice Amount",
        accessor: "amount",
        // isNumeric: true
        sortDescFirst: true
      },
      {
        Header: "Shipment Status",
        accessor: "shippingStatus",
      },
      {
        Header: " Status",
        accessor: "status",
      },
      {
        Header: " LoanId",
        accessor: "paymentDetails.loanId",
      },
      {
        Header: "Due Date",
        accessor: "shortDate",
      },
      {
        Header: "Details",
        accessor: "details",
      },
    ],
    [],
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    { columns, 
      data
    }, useFilters, useSortBy)

  return (
    <Stack spacing="15px">

    <Table {...getTableProps()}>
      <Thead
        bg="gray.100"
      >
        {headerGroups.map((headerGroup) => (
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <Th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                isNumeric={column.isNumeric}
              >
                {column.render("Header")}
                <chakra.span pl="4">
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <TriangleDownIcon aria-label="sorted descending" />
                    ) : (
                      <TriangleUpIcon aria-label="sorted ascending" />
                    )
                  ) : null}
                </chakra.span>
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row)
          return (
            <Tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <Td {...cell.getCellProps()} isNumeric={cell.column.isNumeric}>
                  {cell.render("Cell")}
                </Td>
              ))}
            </Tr>
          )
        })}
      </Tbody>
    </Table>
    </Stack>
  )
}

export default InvoiceTable