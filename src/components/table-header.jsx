import React from 'react'
import PropTypes from 'prop-types'
import '../styles/table-header.css'

const showTemplate = function () {
  const { fields } = this.props

  return (

    <thead>
      <tr key='table-header'>
        {fields.map(this.getHeaderColumn)}
      </tr>
    </thead>

  )
}

class Header extends React.Component {
  static propTypes() {
    return {
      fields: PropTypes.array.isRequired,
      onSort: PropTypes.func,
      sort: PropTypes.object
    }
  }

    static defaultProps = {
      fields: [],
      onSort: (e) => { },
      sort: {
        sortBy: null,
        sortDesc: false
      }
    }

    constructor(props) {
      super(props)
      this.getHeaderColumn = this.getHeaderColumn.bind(this)
    }

    getHeaderColumn = (f) => {
      let arrowClass = ''
      if (f.sortable) {
        arrowClass = 'sort-by'
        if (this.props.sort.sortBy === f.key) {
          arrowClass = (this.props.sort.sortDesc)
            ? 'arrow-down' : 'arrow-up'
        }
      }

      const onSort = (ev, setDefault) => {
        ev.preventDefault()
        if (setDefault) {
          return this.props.onSort(null, false)
        }
        return (this.props.sort.sortBy === f.key)
          ? (this.props.onSort(f.key, !this.props.sort.sortDesc))
          : this.props.onSort(f.key, this.props.sort.sortDesc)
      }

      return (
        <th key={f.key}>
          <div onClick={(e) => onSort(e, true)}>{f.key}</div>
          <a href='' onClick={(e) => onSort(e)} ><i className={arrowClass} /></a>
        </th>
      )
    }

    render() {
      return showTemplate.call(this)
    }
}

export default Header
