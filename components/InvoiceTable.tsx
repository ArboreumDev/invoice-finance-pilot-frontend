import { Stack, Box, Heading, Center, Table, Thead, Tbody, Tr, Th, Td, chakra } from "@chakra-ui/react"
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"
import { useTable, useSortBy, useFilters} from "react-table"
import {ReceiverDetails} from "./ReceiverDetails"
import { dec_to_perc } from "../lib/currency"
import { Currency } from "./common/Currency";
import InvoiceStatusForm from "./InvoiceStatusForm";
import {Invoice} from "./Main"
import { useRouter } from "next/router";
import React, { useMemo, useEffect, useState } from "react";
import axiosInstance, {fetcher} from "../utils/fetcher"
import { useForm } from "react-hook-form"
import {FinanceStatus} from "./Main"
import {CreditLineInfo} from "./AccountInfo"
import {InvoiceDetails} from "./InvoiceDetails"


interface Props {
  invoices: Invoice[]
}
 

const InvoiceTable = (props: { invoices: Invoice[] }) => {

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
          details: <InvoiceDetails invoice={i}/>,
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
        Header: "Due Date",
        accessor: "paymentDetails.collectionDate",
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
                <>
                <Td {...cell.getCellProps()} isNumeric={cell.column.isNumeric}>
                  {cell.render("Cell")}
                </Td>
                </>
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