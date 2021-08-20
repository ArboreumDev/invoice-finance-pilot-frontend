import {Stack, Box, Table, Thead, Tbody, Tr, Th, Td, chakra, Select} from "@chakra-ui/react"
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"
import { useTable, useSortBy, useFilters } from "react-table"
import React from "react";
import {SupplierInfo} from "../Main"
import {ModTermsModal} from "../whitelist/AddWhitelistModal";


const SupplierTable = (props: { suppliers: SupplierInfo[] }) => {
  const currencyToString = (amount) => {
    return amount.toLocaleString("en-IN", { 
        style: "currency",
        currency: "INR" ,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })
    }

  const data = React.useMemo(
    () => props.suppliers.map((s: SupplierInfo) => {
        return {
          ...s,
          creditlineSize: currencyToString(s.creditlineSize),
          edit: <ModTermsModal 
            supplierId={s.id} name={s.name} apr={s.defaultTerms.apr}
            tenor={s.defaultTerms.tenorInDays} creditline={s.creditlineSize}
            creditlineId={s.creditlineId}
          />,
          }
      }),
    [props.suppliers]
  )
  console.log('s', props.suppliers)

  const columns = React.useMemo(
    () => [
      {
        Header: "Supplier Name",
        accessor: "name",
        disableFilters: true
      },
      {
        Header: "Creditline ID",
        accessor: "creditlineId",
        disableFilters: true
      },
      {
        Header: "Credit Limit",
        accessor: "creditlineSize",
        sortDescFirst: true,
        disableFilters: true
      },
      {
        Header: "APR",
        accessor: "defaultTerms.apr",
        disableFilters: true
      },
      {
        Header: "tenor (days)",
        accessor: "defaultTerms.tenorInDays",
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
 
export default SupplierTable