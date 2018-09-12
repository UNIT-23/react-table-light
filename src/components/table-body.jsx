
import React from 'react'
import PropTypes from 'prop-types'

const showTemplate = function () {
  const { fields, items } = this.props

  return (
    <tbody>
      {items.map((item, rI) => {
        return (
          <tr key={rI}>
            {
              fields.map((field, cI) => {
                return (field.formatter && typeof field.formatter === 'function')
                  ? <td key={`${field.key}${rI}`}>{field.formatter(item[field.key], rI, item)}</td>
                  : <td key={`${field.key}${rI}`}>{`${item[field.key]}`}</td>
              })
            }
          </tr>
        )
      })}
    </tbody>

  )
}

class Body extends React.Component {
  static propTypes() {
    return {
      fields: PropTypes.array.isRequired,
      items: PropTypes.array
    }
  }
    static defaultProps = {
      fields: [],
      items: []
    }

    render() {
      return showTemplate.call(this)
    }
}

export default Body
