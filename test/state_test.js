const {describe, it} = require('mocha')
const {expect} = require('chai')
const fetchMock = require('fetch-mock')
const State = require('../lib/state').default
const fakeCustomers = require('./fake-customers.json')

describe('State tests', ()=>{
  describe('initial state', () => {
  
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
    const dataSource = 'fakeDataUrl'
  
    beforeEach(()=> state = new State())
    afterEach(fetchMock.restore)
  
    it('should return initial state for first rendering', async ()=> {
      fetchMock.mock('*', fakeCustomers)
      var callsCount = 0
      await state.actionLoadData(dataSource, newState => {
        callsCount++
        if(callsCount == 1){
          expect(newState.totalItemsCount(), 'initial items shild be []').to.equal(0)
          expect(newState.isLoading(), 'loading in process').to.be.true
        }
      })
      expect(callsCount, 'callback was called only twice').to.equal(2)
    })
  
    it('should correctly populate items', async () => {
      fetchMock.mock('*', fakeCustomers)    
      var callsCount = 0
      await state.actionLoadData(dataSource, newState => {
        callsCount++
        if(callsCount == 2){
          expect(newState.totalItemsCount(), 'items populated correctly').to.equal(fakeCustomers.length)
          expect(fakeCustomers.every(el => (newState.items().map(i => i.id)).includes(el.id))).to.be.true
          expect(newState.isLoading(), 'loading is completed').to.be.false
          expect(newState.isFailed(), 'no fail occures').to.be.false
        }
      })
    })
  
    it('should catch loading error', async () => {
      fetchMock.mock('*', Promise.reject('some network error!'))
  
      var callsCount = 0
      await state.actionLoadData(dataSource, newState => {
        callsCount++
        if(callsCount == 2){
          expect(newState.totalItemsCount(), 'no customers were added').to.equal(0)
          expect(newState.isLoading(), 'loading is completed').to.be.false
          expect(newState.isFailed(), 'fail is catched').to.be.true
          expect(newState.lastError().length, 'lastError shold contain a error message').to.be.greaterThan(0)
        }
      })
      expect(callsCount, 'callback was called only twice').to.equal(2)
    })
  })
})