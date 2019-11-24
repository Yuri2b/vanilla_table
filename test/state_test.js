const {describe, it} = require('mocha')
const {expect} = require('chai')
const fetchMock = require('fetch-mock')
const State = require('../lib/state').default

describe('State initial state', () => {

  const state = new State()

  it('getters values', () => {
    expect(state.activeItemId()).to.equal(undefined)
    expect(state.searchQuery()).to.equal('')
    expect(state.orderBy()).to.eql({
      column: 'id',
      order: 'asc'
    })
    expect(state.isLoading()).to.be.false
    expect(state.isFailed()).to.be.false
    expect(state.lastError()).to.equal('')
    expect(state.currentPage()).to.equal(1)
  })

  it('computed values', () => {
    expect(state.totalItemsCount()).to.equal(0)
    expect(state.activeCustomer()).to.equal(undefined)
    expect(state.items()).to.eql([])
    expect(state.pagesCount()).to.equal(1)
  })
})

describe('actionLoadData', () => {

  let state
  const fakeCustomers = [
    {
      "id": 72,
      "firstName": "Marzee",
      "lastName": "User",
      "email": "CMorgan@dolor.io",
      "phone": "(292)583-5047",
      "adress": {
        "streetAddress": "1509 Augue Ave",
        "city": "Temecula",
        "state": "NH",
        "zip": "28505"
      },
      "description": "convallis et velit sagittis sed sed et magna consequat amet vitae tincidunt eros quis eget vel placerat suspendisse odio placerat facilisis sed nullam sollicitudin ac dolor aliquam nec sed ipsum molestie rutrum"
    }, {
      "id": 603,
      "firstName": "Elisha",
      "lastName": "Lammers",
      "email": "THadley@at.com",
      "phone": "(722)738-3488",
      "adress": {
        "streetAddress": "2569 Tincidunt Dr",
        "city": "Denton",
        "state": "HI",
        "zip": "61629"
      },
      "description": "sed vitae nec donec tempor dolor vestibulum sit adipiscing suspendisse sollicitudin magna non et facilisis quis suspendisse ante id hendrerit lacus sed et dolor magna massa vestibulum non molestie magna curabitur facilisis"
    }, {
      "id": 54,
      "firstName": "Nattakarn",
      "lastName": "Leonard",
      "email": "ESherwood@velit.gov",
      "phone": "(737)263-8109",
      "adress": {
        "streetAddress": "4570 Magna Rd",
        "city": "Colfax",
        "state": "MN",
        "zip": "45833"
      },
      "description": "ipsum consectetur magna porttitor sit dolor suspendisse amet quis turpis tincidunt consequat lacus odio nec facilisis lacus lacus quis porta magna at aliquam velit placerat ac facilisis hendrerit hendrerit lectus mattis et"
    }
  ]

  const dataSource = 'fakeDataUrl'

  beforeEach(()=> state = new State())
  afterEach(fetchMock.restore)

  it('should populate items', async () => {
    fetchMock.mock('*', fakeCustomers)    

    var callsCount = 0
    await state.actionLoadData(dataSource, newState => {
      callsCount++
      if(callsCount == 1){
        expect(newState.totalItemsCount(), 'initial items shild be []').to.equal(0)
        expect(newState.isLoading(), 'loading in process').to.be.true
      }
      else if(callsCount == 2){
        expect(newState.totalItemsCount(), 'items populated correctly').to.equal(fakeCustomers.length)
        expect(newState.isLoading(), 'loading is completed').to.be.false
        expect(newState.isFailed(), 'no fail occures').to.be.false
      }
    })
    expect(callsCount, 'callback was called only twice').to.equal(2)
  })

  it('should catch loading error', async () => {
    fetchMock.mock('*', Promise.reject('some network error!'))

    var callsCount = 0
    await state.actionLoadData(dataSource, newState => {
      callsCount++
      if(callsCount == 1){
        expect(newState.totalItemsCount(), 'initial items = []').to.equal(0)
        expect(newState.isLoading(), 'loading in process').to.be.true
      }
      else if(callsCount == 2){
        expect(newState.totalItemsCount(), 'no customers were added').to.equal(0)
        expect(newState.isLoading(), 'loading is completed').to.be.false
        expect(newState.isFailed(), 'fail is catched').to.be.true
        expect(newState.lastError().length, 'lastError shold contain a error message').to.be.greaterThan(0)
      }
    }).catch(er => {})
    expect(callsCount, 'callback was called only twice').to.equal(2)
  })
})