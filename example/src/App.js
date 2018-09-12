import React, { Component } from 'react'

import Table from 'react-table-light'
import axios from 'axios'
import qs from 'querystring'


export default class App extends Component {

  constructor(props)
  {
    super(props)
    let fields = [
        {
            key: 'id',
            filterType: 'search',
            isNumber: true
        },
        {
            key: 'firstName',
            sortable: true
        },
        {
            key: 'lastName',
            formatter: (v, i, item) => {
                return v
            },
            filterType: 'search'
        },
        {
            key: 'email',
            sortable: true
        },
        {
            key: 'isActive',
            filterType: 'select',
            options: [
                { value: true, text: 'Active' },
                { value: false, text: 'InActive' }
            ]
        },
        {
            key: 'fullName',
            formatter: (v, i, item) => {
                return <button onClick={(e) => this.showFullName(item)}> show </button>
            }
        }
    ]
    let items = [
        {
            "id": 0,
            "firstName": "Shirley",
            "lastName": "Lakin",
            "email": "Daija_Kemmer65@hotmail.com",
            "isActive": true
        },
        {
            "id": 1,
            "firstName": "Alysson",
            "lastName": "Hudson",
            "email": "Rhea37@hotmail.com",
            "isActive": true
        },
        {
            "id": 2,
            "firstName": "Alverta",
            "lastName": "Marks",
            "email": "Jaquan_Littel10@yahoo.com",
            "isActive": false
        },
        {
            "id": 3,
            "firstName": "Jeanne",
            "lastName": "Collins",
            "email": "Joanie51@hotmail.com",
            "isActive": false
        },
        {
            "id": 4,
            "firstName": "Shirley",
            "lastName": "Lakin",
            "email": "Daija_Kemmer65@hotmail.com",
            "isActive": true
        },
        {
            "id": 5,
            "firstName": "Alysson",
            "lastName": "Hudson",
            "email": "Rhea37@hotmail.com",
            "isActive": true
        },
        {
            "id": 6,
            "firstName": "Alverta",
            "lastName": "Marks",
            "email": "Jaquan_Littel10@yahoo.com",
            "isActive": false
        },
        {
            "id": 7,
            "firstName": "Jeanne",
            "lastName": "Collins",
            "email": "Joanie51@hotmail.com",
            "isActive": false
        }
    ]

    this.state = {
        fields,
        items
    }
    this.getItems = this.getItems.bind(this)
  }

  showFullName(item) {
    alert(`${item.firstName} ${item.lastName}`)
  }

  getItems({ currentPage, itemsPerPage, fields, sort }) {
      let offset = (currentPage - 1) * itemsPerPage
      let limit = itemsPerPage
      let filter = {
          '_start': offset,
          '_limit': limit
      }

      fields.forEach((f) => {
          if (f.value !== null && f.value !== '') {
              filter[f.key] = f.value
          }
      })
      if (sort.sortBy) {
          filter['_sort'] = sort.sortBy
          filter['_order'] = sort.sortDesc ? 'desc' : 'asc'
      }
      return axios.get(`http://localhost:4000/employees?${qs.stringify(filter)}`)
          .then((res) => {
              let count = res.headers['x-total-count']
              let items = res.data
              return { items, count }
          })
  }

  render () {
    const { fields, items } = this.state;
        return (
            <Table
                fields={fields}
                items={items}
                // fetchItems={this.getItems}
                itemsPerPage={10}
            />

        )
  }
}
