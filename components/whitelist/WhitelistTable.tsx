import {Text, Stack, Button, Box, Input, Table, Thead, Tbody, Tr, Th, Td, chakra, Select} from "@chakra-ui/react"
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"
import { useTable, useSortBy, useFilters } from "react-table"
import React, {useMemo, useState} from "react";
import {FinanceStatus, ReceiverInfo, SupplierInfo} from "../Main"
import {CreditLineInfo, CreditSummary} from "../CreditlinesTable"
import {ModTermsModal} from "./AddWhitelistModal"


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
      {options.map((option: string) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </Select>
  )
}

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length

  return (
    <Input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

const WhitelistTable = (props: { creditInfo: CreditSummary, suppliers: SupplierInfo[] }) => {
  const {tusker, ...whitelistSummary} = props.creditInfo
  const whitelist = [].concat(...[...Object.values(whitelistSummary)].map(x=>Object.values(x)))
  const currencyToString = (amount) => {
    return amount.toLocaleString("en-IN", { 
        style: "currency",
        currency: "INR" ,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })
    }

  const getSupplierFromCreditlineInfo = (w: CreditLineInfo) => {
    return props.suppliers.filter((s) => s.id === w.supplierId)[0]
  }

  const getSupplierDescriptor = (w: CreditLineInfo) => {
    try {
      const s = getSupplierFromCreditlineInfo(w)
      const data = JSON.parse(s.data)
      return <> <Text>{data.phone}, {data.city}</Text> </>
    } catch (err) {
      console.log("could not parse supplier data")
      return <Text>???</Text>
    }
  }

  const data = React.useMemo(
    () => whitelist.map((w: CreditLineInfo) => {
        return {
          ...w,
          supplierDescriptor: getSupplierDescriptor(w),
          creditlineSize: currencyToString(w.info.terms.creditlineSize),
          edit: <ModTermsModal supplierId={w.supplierId} name={w.info.name} apr={w.info.terms.apr}
                               tenor={w.info.terms.tenorInDays} creditline={w.info.terms.creditlineSize}
                               purchaserId={w.info.id} editableTerms={['CREDITLIMIT']}
                               />,
          supplier: {...props.suppliers.filter((s) => s.id === w.supplierId)[0]}

        }
      }),
    [props.creditInfo]
  )

  const columns = React.useMemo(
    () => [
      {
        Header: "Supplier Name",
        accessor: "supplier.name",
        Filter: SelectColumnFilter,
        filter: 'includes',
      },
      {
        Header: "Supplier Details",
        accessor: "supplierDescriptor",
        disableFilters: true
      },
      {
        Header: "Receiver Name",
        accessor: "info.name",
        disableFilters: true
      },
      {
        Header: "Relationship Credit Limit",
        accessor: "creditlineSize",
        // isNumeric: true
        sortDescFirst: true,
        disableFilters: true
      },
      {
        Header: "Purchaser Phone",
        accessor: "info.phone",
        disableSortBy: true,
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
 
export default WhitelistTable