import React from 'react'
import PropTypes from 'prop-types'
import qs from 'querystring'
import TableHeader from './components/table-header.jsx'
import TableBody from './components/table-body.jsx'
import TablePagination from './components/table-pagination.jsx'
import TableFilter from './components/table-filter.jsx'
import createHistory from 'history/createBrowserHistory'
const history = createHistory()

const showTemplate = function () {
  const { fields, itemsPerPage } = this.props
  const { items, totalRows, currentPage, tableFilter, sort } = this.state

  return (
    <div className='table-container'>
      <table>
        <TableHeader fields={fields} onSort={this.onSort} sort={sort} />
        <TableFilter
          fields={fields}
          tableFilter={tableFilter}
          onFilterChange={this.onFilterChange} />
        <TableBody fields={fields} items={items} />
      </table>
      <TablePagination
        onPageChange={this.onPageChange}
        itemsPerPage={itemsPerPage}
        totalRows={totalRows}
        currentPage={currentPage} />
    </div>
  )
}

export default class ReactTable extends React.Component {
  static propTypes() {
    return {
      fields: PropTypes.array.isRequired,
      items: PropTypes.array,
      fetchItems: PropTypes.func,
      itemsPerPage: PropTypes.number,
      onPageChange: PropTypes.func,
      onSort: PropTypes.func,
      onFilter: PropTypes.func
    }
  }

    static defaultProps = {
      fields: [],
      items: [],
      itemsPerPage: 0,
      onPageChange: (pg) => { },
      onSort: () => { },
      onFilter: () => { }
    }

    constructor(props) {
      super(props)
      this.initialState = {
        pending: false,
        currentPage: 1,
        totalRows: props.items.length,
        itemsPerPage: props.itemsPerPage,
        items: props.items,
        tableFilter: {},
        sort: {
          sortBy: null,
          sortDesc: false
        }
      }

      this.state = this.initState(this.initialState)
      this.getPaginatedItems = this.getPaginatedItems.bind(this)
      this.onPageChange = this.onPageChange.bind(this)
      this.onFilterChange = this.onFilterChange.bind(this)
      this.updateQueryString = this.updateQueryString.bind(this)
      this.onSort = this.onSort.bind(this)
    }

    componentWillMount() {
      console.log('Will Mount')

      this.updateQueryString()
      this._getItems()
    }

    componentDidUpdate(prevProps, prevState) {
      console.log('Updated')

      this.updateQueryString()
      if (this.shouldItemsUpdate(prevProps, prevState)) {
        this._getItems()
      }
    }

    initState(defaultState) {
      let queryFilter = history.location.search.replace('?', '')
      queryFilter = qs.parse(queryFilter)
      let { currentPage, totalRows, filter, sortBy, sortDesc } = queryFilter
      filter = filter ? JSON.parse(filter) : {}

      this.props.fields.forEach((field) => {
        if (field.filterType) {
          defaultState.tableFilter[field.key] = {
            ...field,
            value: (filter[field.key]) || field.defaultValue || null
          }
        }
      })

      defaultState.sort.sortBy = sortBy || null
      defaultState.sort.sortDesc = ['true', true].includes(sortDesc)
      defaultState.currentPage = Number(currentPage) || defaultState.currentPage
      defaultState.totalRows = Number(totalRows) || defaultState.totalRows
      return defaultState
    }

    async _getItems() {
      console.log('_getItems')
      this.setState({ pending: true })
      if (typeof this.props.fetchItems === 'function') {
        const {
          currentPage,
          itemsPerPage,
          tableFilter,
          sort
        } = this.state
        const { items, count } = await this.props.fetchItems({
          currentPage,
          itemsPerPage,
          sort,
          fields: Object.values(tableFilter)
        })
        this.setState({
          items, totalRows: count || 0, pending: false
        })
      } else {
        let items = [...this.props.items]
        items = this.getFilteredItems(items)
        let filteredLength = items.length
        items = this.getPaginatedItems(items)
        this.setState({
          items, totalRows: filteredLength, pending: false
        })
      }
    }

    getFilteredItems(items) {
      let fields = Object.values(this.state.tableFilter)
      items = fields.reduce((itemsArr, field) => {
        if (field.value !== null && field.value !== '') {
          itemsArr = itemsArr.filter((item) => {
            if (typeof item[field.key] === 'string') {
              return (item[field.key].indexOf(field.value) !== -1)
            } else if (!isNaN(Number(field.value)) && field.isNumber) {
              return (item[field.key] === Number(field.value))
            } else if (typeof item[field.key] === 'boolean') {
              return (String(item[field.key]) === String(field.value))
            } else {
              return (item[field.key] === field.value)
            }
          })
        }
        return itemsArr
      }, items)

      if (this.state.sort.sortBy) {
        let sortField = this.state.sort.sortBy
        let sortDesc = this.state.sort.sortDesc
        items = items.sort((a, b) => {
          a = a[sortField].toLowerCase()
          b = b[sortField].toLowerCase()
          if (sortDesc) {
            return (a > b) ? -1 : (a < b) ? 1 : 0
          } else {
            return (a > b) ? 1 : (a < b) ? -1 : 0
          }
        })
      }
      return items
    }

    onSort(sortBy, sortDesc) {
      this.setState({
        sort: {
          sortBy,
          sortDesc
        }
      })
    }

    onFilterChange(event, { key }) {
      let { tableFilter } = this.state
      let currentPage = 1
      let value = (typeof event.target.value === 'string')
        ? event.target.value.trim() : event.target.value

      this.setState({
        tableFilter: {
          ...tableFilter,
          [key]: {
            ...tableFilter[key],
            value
          }
        },
        currentPage
      })
    }

    updateQueryString() {
      let query = {
        currentPage: this.state.currentPage,
        totalRows: this.state.totalRows
      }
      if (this.state.sort.sortBy) {
        query.sortBy = this.state.sort.sortBy
        query.sortDesc = this.state.sort.sortDesc
      }
      let filter = {}
      Object.values(this.state.tableFilter).forEach((f) => {
        if (f.value !== null && f.value !== '') {
          filter[f.key] = f.value
          query.filter = JSON.stringify(filter)
        }
      })
      history.replace({
        path: history.location.pathname,
        search: `${qs.stringify(query)}`
      })
    }

    getPaginatedItems(items) {
      let { itemsPerPage } = this.props
      let { currentPage } = this.state

      return (itemsPerPage)
        ? items.slice((currentPage - 1) * itemsPerPage, (currentPage) * itemsPerPage)
        : items || []
    }

    shouldItemsUpdate(prevProps, prevState) {
      let filterFields = Object.values(prevState.tableFilter)
      let isFilterChanged = filterFields.some((field) => {
        return this.state.tableFilter[field.key].value !== field.value
      })
      return (prevState.currentPage !== this.state.currentPage) ||
            (prevState.sort.sortBy !== this.state.sort.sortBy) ||
            (prevState.sort.sortDesc !== this.state.sort.sortDesc) ||
            isFilterChanged
    }

    onPageChange(currentPage) {
      this.setState({ currentPage })
    }

    render() {
      console.log('render')
      return showTemplate.call(this)
    }
}
