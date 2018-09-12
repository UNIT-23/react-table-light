import React from 'react'
import PropTypes from 'prop-types'
import '../styles/table-pagination.css'

const showTemplate = function () {
  let { range } = this.state

  let pageNums = []
  for (let pg = 1; pg <= range; pg++) {
    const isCurrent = (pg === this.props.currentPage)
    const onClick = (ev, pg) => {
      ev.preventDefault()
      this.props.onPageChange(pg)
    }
    pageNums.push(
      <a className={isCurrent ? 'page-link active' : 'page-link'}
        onClick={(e) => onClick(e, pg)}
        key={pg.toString()}
        href=''>
        {pg}
      </a>
    )

    if (pg === 1 && !isCurrent) {
      pageNums.unshift(<a href='' key='left' onClick={(e) => onClick(e, this.props.currentPage - 1)} >&laquo;</a >)
    }
    if (pg === range && !isCurrent) {
      pageNums.push(<a href='' key='right' onClick={(e) => onClick(e, this.props.currentPage + 1)} >&raquo;</a >)
    }
  }

  return (
    <div className='pagination'>
      {
        pageNums
      }
    </div>
  )
}

class Pagination extends React.Component {
  static propTypes() {
    return {
      currentPage: PropTypes.number,
      totalRows: PropTypes.number,
      itemsPerPage: PropTypes.number,
      onPageChange: PropTypes.func
    }
  }

    static defaultProps = {
      currentPage: 0,
      totalRows: 0,
      itemsPerPage: 0,
      onPageChange: (pg) => { }
    }

    constructor(props) {
      super(props)

      let range = (props.totalRows)
        ? Math.ceil(props.totalRows / props.itemsPerPage) : 0

      this.updateRange = this.updateRange.bind(this)
      this.state = {
        range
      }
    }

    componentWillUpdate(nextProps) {
      if (this.props.totalRows !== nextProps.totalRows) {
        this.updateRange(nextProps.totalRows)
      }
    }

    updateRange(totalRows) {
      let range = (totalRows)
        ? Math.ceil(totalRows / this.props.itemsPerPage) : 0

      this.setState({
        range
      })
    }

    render() {
      return showTemplate.call(this)
    }
}

export default Pagination
