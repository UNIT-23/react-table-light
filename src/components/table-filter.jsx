import React from 'react'
import PropTypes from 'prop-types'

const showTemplate = function () {
  const { fields } = this.props

  return (

    <thead>
      <tr key='table-filter'>
        {fields.map(this.getFilterColumn)}
      </tr>
    </thead>

  )
}

class Filter extends React.Component {
  static propTypes() {
    return {
      fields: PropTypes.array.isRequired,
      tableFilter: PropTypes.object.isRequired,
      onFilterChange: PropTypes.func.isRequired
    }
  }
    static defaultProps = {
      fields: [],
      tableFilter: {},
      onFilterChange: (e) => { }
    }

    constructor(props) {
      super(props)
      this.getFilterColumn = this.getFilterColumn.bind(this)
      this.getSearchFilter = this.getSearchFilter.bind(this)
      this.getSelectFilter = this.getSelectFilter.bind(this)
    }

    getSearchFilter = (f) => {
      const onChange = ev => {
        ev.preventDefault()
        this.props.onFilterChange(ev, f)
      }
      return (
        <td key={f.key}>
          <input
            type={f.isNumber ? 'number' : 'text'}
            value={this.props.tableFilter[f.key].value || ''}
            onChange={onChange}
          />
        </td>
      )
    }

    getSelectFilter = (f) => {
      const onChange = ev => {
        ev.preventDefault()
        this.props.onFilterChange(ev, f)
      }
      let options = f.options || []
      return (
        <td key={f.key}>
          <select onChange={onChange} value={this.props.tableFilter[f.key].value || ''} >
            <option value=''>All</option>
            {
              options.map((o) => {
                return (<option key={o.value} value={o.value}>{o.text}</option>)
              })
            }
          </select>
        </td>
      )
    }

    getFilterColumn = (f) => {
      switch (f.filterType) {
        case 'search':
          return this.getSearchFilter(f)
        case 'select':
          return this.getSelectFilter(f)
        default:
          return <td key={f.key} />
      }
    }

    render() {
      return showTemplate.call(this)
    }
}

export default Filter
