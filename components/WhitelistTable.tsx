import { Stack, Button, Box, Heading, Center, Table, Thead, Tbody, Tr, Th, Td, chakra } from "@chakra-ui/react"
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"
import { useTable, useSortBy } from "react-table"
import React, { useMemo } from "react";
import {FinanceStatus, ReceiverInfo} from "./Main"
import {ReceiverDetails} from "./ReceiverDetails"
import { dec_to_perc } from "../lib/currency"
import { Currency } from "./common/Currency";
import InvoiceStatusForm from "./InvoiceStatusForm";
import { CreditLineInfo} from "./CreditlinesTable"
import {ModWhitelistModal} from "./AddWhitelistModal"



const WhitelistTable = (props: { whitelist: CreditLineInfo[], supplier: string }) => {

  const currencyToString = (amount) => {
    return amount.toLocaleString("en-IN", { 
        style: "currency",
        currency: "INR" ,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })
    }

  const data = React.useMemo(
    () => props.whitelist.map((w: CreditLineInfo) => {
        return {
          ...w,
          creditlineSize: currencyToString(w.info.terms.creditlineSize),
          edit: <ModWhitelistModal supplier={props.supplier} entry={w} />
        }
      }),
    [props.whitelist]
  )

  const columns = React.useMemo(
    () => [
      {
        Header: "Receiver Name",
        accessor: "info.name",
      },
      {
        Header: "Credit Limit",
        accessor: "info.terms.creditlineSize",
        // isNumeric: true
        sortDescFirst: true
      },
      {
        Header: "APR",
        accessor: "info.terms.apr",
      },
      {
        Header: "tenor (days)",
        accessor: "info.terms.tenorInDays",
      },
      {
        Header: "Phone",
        accessor: "info.phone",
        disableSortBy: true,
      },
      {
        Header: "",
        accessor: "edit"
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
 
export default WhitelistTable