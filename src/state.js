export default function State(initialItems) {
// state store ////////////////////////
  let items = initialItems || []
  let isLoading = false
  let isFailed = false
  let lastError = ''
  let currentPage = 1
  let perPage = 25
  let activeItemId = undefined
  let searchQuery = ''
  const orderBy = {
    column: 'id',
    order: 'asc'
  }

// computed ////////////////////////////
  this.totalItemsCount = () => filtered().length
  this.activeCustomer = () => items.find(el => el.id == activeItemId)

  const filtered = () => {
    let data = items.slice()
    if(searchQuery){
      data = data.filter( item => {
        return Object.keys(item).some( key => {
          return String(item[key]).toLowerCase().indexOf(searchQuery.toLowerCase()) > -1
        })
      })
    }      
    data = data.sort((a,b) => {
      a = a[orderBy.column]
      b = b[orderBy.column]
      return  (a === b ? 0 : a > b ? 1 : -1 ) * (orderBy.order == 'asc' ? 1 : -1)
    })      
    return data
  }
  
  this.items = () => {
    return filtered().slice((currentPage-1)*perPage,currentPage*perPage)
  }
  
  this.pagesCount = () => {
    const count = filtered().length
    return count == 0 ? 1
      : count%perPage == 0 ? count/perPage
      : Math.floor(count/perPage) + 1
  }

  
  // getters /////////////////////////
  
  this.activeItemId = () => activeItemId
  this.searchQuery = () => searchQuery
  this.orderBy = () => orderBy
  this.isLoading = () => isLoading
  this.isFailed = () => isFailed
  this.lastError = () => lastError
  this.currentPage = () => currentPage
  
    
  // actions //////////////////////////

  this.actionLoadData = (dataSource, callback) => {
    isFailed = false
    isLoading = true
    callback(Object.assign({}, this))
    return fetch(dataSource)
    .then(res => {
      res.json()
      .then( data => {
        items = data.map(el => {
          let {city, state, streetAddress, zip} = el.adress
          return {
            id: el.id,
            name: el.firstName,
            surname: el.lastName,
            email: el.email,
            phone: el.phone,
            description: el.description,
            address: `${zip}, ${city} ${state}, ${streetAddress}`,
            ...el.adress
          }
        })
        isLoading = false
        callback(Object.assign({}, this))
      })
    })
    .catch(er => {
      isLoading = false
      isFailed = true
      lastError = er
      callback(Object.assign({}, this))
    })
  }
  
  this.actionSetPage = (page, callback) => {
    currentPage = page
    // activeItemId = undefined
    callback(Object.assign({}, this))
  }
  
  this.actionSetActiveItemId = (itemId, callback) => {
    activeItemId = itemId
    callback(Object.assign({}, this))
  }
  
  this.actionSetSearchQuery = (query, callback) => {
    searchQuery = query
    if(searchQuery){
      currentPage = 1
      activeItemId = undefined
    }
    callback(Object.assign({}, this))
  }
  
  this.actionSetOrder = (columnToOrder, callback) => {
    orderBy.column = columnToOrder
    orderBy.order = orderBy.order == 'asc' ? 'dsc' : 'asc'
    callback(Object.assign({}, this))
  }
}