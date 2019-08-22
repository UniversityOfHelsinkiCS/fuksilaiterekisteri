import React, { useState } from 'react'
import { Table } from 'semantic-ui-react'
import { sortBy } from 'lodash'
import './sortedTable.css'

const DIRECTIONS = {
  ASC: 'ascending',
  DESC: 'descending',
}

const SortableTable = (props) => {
  const {
    defaultdescending,
    defaultsortkey,
    columns,
    data,
    tableProps,
    getRowProps,
    getRowKey,
  } = props
  const [direction, setDirection] = useState(defaultdescending ? DIRECTIONS.DESC : DIRECTIONS.ASC)
  const [selected, setSelected] = useState(defaultsortkey == null ? columns[0].key : defaultsortkey)

  const handleSort = column => () => {
    if (selected === column) {
      setDirection(direction === DIRECTIONS.ASC ? DIRECTIONS.DESC : DIRECTIONS.ASC)
    } else {
      setSelected(column)
      setDirection(DIRECTIONS.DESC)
    }
  }

  const sortedRows = () => {
    const column = columns.find(c => c.key === selected)
    if (!column) {
      return data
    }
    const { getRowVal } = column
    const sorted = sortBy(data, [getRowVal])
    return direction === DIRECTIONS.ASC ? sorted : sorted.reverse()
  }

  const sortDirection = name => (selected === name ? direction : null)

  return (
    <Table sortable {...tableProps} className="fixed-header">
      <Table.Header>
        <Table.Row>
          {columns.filter(c => !(c.title == null)).map(c => (
            <Table.HeaderCell
              key={c.key}
              content={c.title}
              onClick={c.disabled ? null : handleSort(c.key)}
              sorted={sortDirection(c.key)}
              {...c.headerProps}
            />
          ))
          }
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {sortedRows().map(row => (
          <Table.Row
            key={getRowKey(row)}
            {...getRowProps && getRowProps(row)}
          >
            {columns.filter(c => !c.parent).map(c => (
              <Table.Cell
                key={c.key}
                content={c.getRowContent ? c.getRowContent(row) : c.getRowVal(row)}
                {...c.cellProps}
                {...c.getCellProps && c.getCellProps(row)}
              />
            ))
            }
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

export default SortableTable