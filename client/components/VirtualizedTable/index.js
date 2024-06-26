import React, { useState, useMemo } from 'react'
import {
  AutoSizer, Table, Column, SortDirection, ScrollSync, ColumnSizer,
} from 'react-virtualized'
import { sortBy as lodashSortBy, debounce } from 'lodash'
import { Input } from 'semantic-ui-react'
import './virtualizedTable.css'

const VirtualizedTable = ({
  data, columns, rowHeight = 50, headerHeight = 30, searchable, defaultCellWidth,
}) => {
  const [sortBy, setSortBy] = useState('device_returned_at')
  const [sortDirection, setSortDirection] = useState(SortDirection.ASC)
  const [filter, setFilter] = useState('')

  const dateBasedSorter = (a, b) => {
    const aVal = a.deviceReturnedAt
    const bVal = b.deviceReturnedAt

    return new Date(aVal).getTime() - new Date(bVal).getTime()
  }

  console.log('process.env.NODE_ENV', process.env.NODE_ENV)

  const sortedData = useMemo(() => {
    const selectedColumn = columns.find(({ key }) => sortBy === key)
    if (!selectedColumn || !(selectedColumn.getCellVal || selectedColumn.renderCell)) return data
    let result = lodashSortBy(data, selectedColumn.getCellVal || selectedColumn.renderCell)

    if (process.env.NODE_ENV === 'production' && sortBy === 'device_returned_at') {
      result = data.sort(dateBasedSorter)
    }

    if (sortDirection === SortDirection.ASC) result.reverse()
    return result
  }, [sortBy, sortDirection, data])

  const valueIsObject = value => typeof value === 'object' && value !== null

  const valueContainsSearch = value => value && String(value).trim().toLowerCase().includes(filter.trim().toLowerCase())

  const traverseSearch = (value) => {
    if (!valueIsObject(value)) {
      return valueContainsSearch(value)
    }
    return Object.values(value).some(v => traverseSearch(v))
  }

  const filteredData = useMemo(() => sortedData.filter((params) => {
    if (!filter) {
      return true
    }
    return traverseSearch(params)
  }), [sortBy, sortDirection, filter, data])

  const handleFilterChange = debounce((_, { value }) => {
    setFilter(value)
  }, 300)

  const manualWidths = useMemo(() => columns.reduce((acc, { width }) => (width ? acc + (width - defaultCellWidth) : acc), 0), [columns])

  return (
    <div style={{
      minHeight: '300px', maxWidth: '100%', flex: 1, display: 'flex', overflowX: 'auto',
    }}
    >
      <div style={{ flex: 1 }}>
        { searchable && <Input onChange={handleFilterChange} placeholder="Search..." icon="search" /> }
        <AutoSizer disableWidth>
          {({ height }) => (
            <ScrollSync>
              {({ onScroll, scrollLeft, scrollTop }) => (
                <ColumnSizer columnCount={columns.length} width={(columns.length * defaultCellWidth) + manualWidths}>
                  {({ adjustedWidth, columnWidth, registerChild }) => (
                    <Table
                      ref={registerChild}
                      height={searchable ? height - 40 : height}
                      width={adjustedWidth}
                      headerHeight={headerHeight}
                      rowHeight={rowHeight}
                      rowCount={filteredData.length}
                      noRowsRenderer={() => 'No results.'}
                      rowGetter={({ index }) => filteredData[index]}
                      sortDirection={sortDirection}
                      sortBy={sortBy}
                      sort={({ sortBy: newSortBy, sortDirection: newSortDirection }) => {
                        setSortBy(newSortBy)
                        setSortDirection(newSortDirection)
                      }}
                      onScroll={onScroll}
                      scrollTop={scrollTop}
                      scrollLeft={scrollLeft}
                    >
                      {
                        columns.map(({
                          label, key, renderCell, disableSort, width,
                        }) => (
                          <Column
                            disableSort={disableSort}
                            width={width || columnWidth}
                            key={key}
                            className={key} // Helper for Cypress
                            label={label}
                            dataKey={key}
                            cellRenderer={({ rowData }) => renderCell(rowData)}
                            onClick={() => setSortBy(key)}
                            style={{ overflow: 'auto' }}
                          />
                        ))
                      }
                    </Table>
                  )}
                </ColumnSizer>
              )}
            </ScrollSync>
          )}
        </AutoSizer>
      </div>
    </div>
  )
}

export default VirtualizedTable
