import { Select, Stack, Box, Heading, Center, Table, Thead, Tbody, Tr, Th, Td, chakra } from "@chakra-ui/react"
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"
import { useTable, useSortBy, useFilters} from "react-table"
import {Invoice} from "./Main"
import React, { useMemo, useEffect, useState } from "react";
import {InvoiceDetails} from "./InvoiceDetails"


function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  console.log('dfddfd', filterValue, preFilteredRows)
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      console.log('r', row)
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

   // Render a multi-select box
  return (
    <Select
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </Select>
    // <div>TODO</div>
  )
}



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
    [props.invoices]
  )

  const columns = React.useMemo(
    () => [
      {
        Header: "Order Id",
        accessor: "orderId",
        disableFilters: true
      },
      {
        Header: "Receiver",
        accessor: "receiverInfo.name",
        disableFilters: true
      },
      {
        Header: "Supplier",
        accessor: "supplierName",
        disableFilters: true
      },
      {
        Header: "Invoice Amount",
        accessor: "amount",
        // isNumeric: true
        sortDescFirst: true,
        disableFilters: true
      },
      {
        Header: "Shipment Status",
        accessor: "shippingStatus",
        disableFilters: true
      },
      {
        Header: " Status",
        accessor: "status",
        disableFilters: true
      },
      {
        Header: " Loan Id",
        accessor: "paymentDetails.loanId",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Due Date",
        accessor: "shortDate",
        disableFilters: true
      },
      {
        Header: "Details",
        accessor: "details",
        disableFilters: true
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
                <Box>
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
                </Box>
                <Box>{column.canFilter ? column.render('Filter') : null}</Box>
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