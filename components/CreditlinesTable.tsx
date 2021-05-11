import { Stack, Box, Heading, Center, Table, Thead, Tbody, Tr, Th, Td, chakra } from "@chakra-ui/react"
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"
import { useTable, useSortBy } from "react-table"
import React, { useMemo } from "react";
import {FinanceStatus, ReceiverInfo} from "./Main"
import {ReceiverDetails} from "./ReceiverDetails"
import { dec_to_perc } from "../lib/currency"
import { Currency } from "./common/Currency";
import InvoiceStatusForm from "./InvoiceStatusForm";


export interface CreditLineInfo {
  used: number
  info: ReceiverInfo
  requested: number
  total: number
  available: number
  invoices: number
}


const CreditlinesTable = (props: { creditLines: CreditLineInfo[] }) => {

  const data = React.useMemo(
    () => props.creditLines.map((c: CreditLineInfo) => {
        return {
          ...c,
          // info: c.info,
          // available: <Currency id={"amount"+ c.available} amount={c.available}/>,
          // used: <Currency amount={c.used}/>,
          // requested: <Currency amount={c.requested}/>,
          // total: <Currency amount={c.total}/>,
          // invoices: c.invoices,
          details: <ReceiverDetails receiver={c.info}/>,
          percUsed: dec_to_perc(c.used / c.total)
        }
      }),
    [props.creditLines]
  )

  const columns = React.useMemo(
    () => [
      {
        Header: "Customer Name",
        accessor: "info.name",
      },
      {
        Header: "Requested",
        accessor: "requested",
        // isNumeric: true
        sortDescFirst: true
      },
      {
        Header: "Used",
        accessor: "used",
        sortDescFirst: true,
      },
      {
        Header: " used (%)",
        accessor: "percUsed",
        sortDescFirst: true
      },

      {
        Header: "Available",
        accessor: "available",
        // sortType: (a,b) => a.amount > b.amount
        // sortType: Function(rowA: <Row>, rowB: <Row>, columnId: String, desc: Bool)
        tDescFirst: true
      },
      {
        Header: "Total Credit Line Size",
        accessor: "total",
        sortDescFirst: true
      },
      {
        Header: "Number of invoices",
        accessor: "invoices",
        sortDescFirst: true
      },
      {
        Header: "Contact",
        accessor: "details",
        disableSortBy: true,
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
      data
    }, useSortBy)

  return (
    <Stack spacing="15px">
      <Box>
        <Heading size="md">Credit Lines</Heading>
      </Box>


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
 
export default CreditlinesTable