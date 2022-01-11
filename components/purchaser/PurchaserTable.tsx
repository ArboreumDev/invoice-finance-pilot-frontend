import {Text, Stack, Box, Table, Thead, Tbody, Tr, Th, Td, chakra} from "@chakra-ui/react"
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"
import { useTable, useSortBy, useFilters } from "react-table"
import React from "react";
import {PurchaserInfo} from "../Main"
import {ModCreditLimitModal} from "./ModCreditLimitModal"



const PurchaserTable = (props: { purchasers: PurchaserInfo[] }) => {
  const currencyToString = (amount) => {
    return amount.toLocaleString("en-IN", { 
        style: "currency",
        currency: "INR" ,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })
    }

  const purchaserToCreditUsed = (p: PurchaserInfo) => {
    const percentage =  (100 * (p.creditUsed/p.creditLimit)).toFixed(0)
    return percentage
  }

  const data = React.useMemo(
    () => props.purchasers.map((p: PurchaserInfo) => {
        return {
          ...p,
          pDescriptor: <Text>{p.name} ({p.phone}, {p.city})</Text>,
          creditLimit: currencyToString(p.creditLimit),
          used:  <p>
              { currencyToString(p.creditUsed)} | {purchaserToCreditUsed(p)}%
            </p> ,
          edit: <ModCreditLimitModal 
            purchaserId={p.id}
            name={p.name}
            creditLimit={p.creditLimit}
           />
          }
      }),
    [props.purchasers]
  )

  const columns = React.useMemo(
    () => [
      {
        Header: "Purchaser Name",
        accessor: "pDescriptor",
        sortDescFirst: false,
        disableFilters: true
      },
      {
        Header: "Purchaser Credit Limit",
        accessor: "creditLimit",
        // sortDescFirst: true,
        disableFilters: true
      },
      {
        Header: "Used (₹ | %)",
        accessor: "used",
        disableFilters: true
      },
      {
        Header: "",
        accessor: "edit",
        disableFilters: true
      }
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
      data,
      initalState: {
        sortBy: [{id: 'name',desc: false}] // TODO: this is not working!
      }
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
              <Th {...column.getHeaderProps(column.getSortByToggleProps())} isNumeric={column.isNumeric}>
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
 
export default PurchaserTable