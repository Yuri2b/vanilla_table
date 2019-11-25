const {describe, it} = require('mocha')
const {expect} = require('chai')

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const appTemplate = require('../lib/template').default
const State = require('../lib/state').default

const fakeCustomers = require('./fake-customers.json')

describe('Template tests', ()=>{
  describe('initial template rendering', ()=>{
      
    const state = new State()
    const dom = new JSDOM(appTemplate(state));
    const doc = dom.window.document

    it('should contain .main-wrapper div', ()=>{
        expect(doc.getElementsByClassName('main-wrapper').length).to.equal(1)
    })

    it('should contain .pagination-wrapper', ()=>{
        expect(doc.getElementsByClassName('pagination-wrapper').length).to.equal(1)
    })

    it('should contain .table-wrapper', ()=>{
        expect(doc.getElementsByClassName('table-wrapper').length).to.equal(1)
    })

    it('should not contain .item-wrapper', ()=>{
        expect(doc.getElementsByClassName('item-wrapper').length).to.equal(0)
    })

    it('should not contain .alert-wrapper', ()=>{
        expect(doc.getElementsByClassName('alert-wrapper').length).to.equal(0)
    })

    it('should not contain .spinner', ()=>{
        expect(doc.getElementsByClassName('spinner').length).to.equal(0)
    })
  })
  
  describe('template rendering with data', ()=>{
      
    const state = new State(fakeCustomers)
    const columns = ['id', 'firstNmae', 'lastName', 'email', 'phone']
    const dom = new JSDOM(appTemplate(state, columns));
    const doc = dom.window.document

    it('should create row for each customer', ()=>{
      expect(doc.querySelectorAll('[data-app-item-id]').length, 'rows count').to.equal(fakeCustomers.length)
    })

    it('should create proper columns', ()=>{
      let columnNames = []
      doc.querySelectorAll('[data-app-column]').forEach(el => columnNames.push(el.dataset['appColumn']))
      
      expect(doc.querySelectorAll('[data-app-column]').length, 'columns count').to.equal(columns.length)
      expect(columns.every(clmn => (columnNames.map(el => el)).includes(clmn))).to.be.true
    })
  })
})
