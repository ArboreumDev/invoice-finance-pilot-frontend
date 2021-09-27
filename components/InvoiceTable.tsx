import { Select, Stack, Button, Box, Heading, Center, Table, Thead, Tbody, Tr, Th, Td, chakra, HStack, Checkbox } from "@chakra-ui/react"
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"
import { useTable, useSortBy, useFilters} from "react-table"
import {Invoice} from "./Main"
import React, { useMemo, useEffect, useState } from "react";
import {InvoiceDetails} from "./InvoiceDetails"
import axiosInstance from "../utils/fetcher"


function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
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
      {options.map((option: string | undefined, i) => (
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

  const verify = async (invoiceId, verified) => {
      try {
          const res = await axiosInstance.post(`/v1/invoice/verification/${invoiceId}/${verified}`)
          if (res.status === 200) {
              alert("Updated.\n (It may take a few seconds until the change becomes visible.)")
          } else {
          alert("error")
          }
      } catch (err) {
          console.log(err)
          alert(err)
      }
  }



  const currencyToString = (amount) => {
    return amount.toLocaleString("en-IN", { 
        style: "currency",
        currency: "INR" ,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })
    }

  const isVerified = (invoice) => {
    return invoice.status !== "INITIAL"
  }
 

  const data = React.useMemo(
    () => props.invoices.map((i: Invoice) => {
        return {
            ...i,
          verified: <Checkbox
                isChecked={i.verified}
                onChange={() => verify(i.invoiceId, !i.verified)}
              >verified</Checkbox>,
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
        Header: " Verified by Tusker",
        accessor: "verified",
        disableFilters: true
      },
      {
        Header: " Loan Id",
        accessor: "paymentDetails.loanId",
        disableFilters: true
        // Filter: SelectColumnFilter,
        // filter: "includes",
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