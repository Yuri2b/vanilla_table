const {describe, it} = require('mocha')
const {expect} = require('chai')

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const appTemplate = require('../lib/template').default
const State = require('../lib/state').default

const state = new State()
const dom = new JSDOM(appTemplate(state));
const doc = dom.window.document

describe('initial template render', ()=>{
    it('should contains .main-wrapper div', ()=>{
        expect(doc.getElementsByClassName('main-wrapper').length).to.equal(1)
    })

    it('should contains .pagination-wrapper', ()=>{
        expect(doc.getElementsByClassName('pagination-wrapper').length).to.equal(1)
    })

    it('should contains .table-wrapper', ()=>{
        expect(doc.getElementsByClassName('table-wrapper').length).to.equal(1)
    })

    it('should not contains .item-wrapper', ()=>{
        expect(doc.getElementsByClassName('item-wrapper').length).to.equal(0)
    })

    it('should not contains .alert-wrapper', ()=>{
        expect(doc.getElementsByClassName('alert-wrapper').length).to.equal(0)
    })

    it('should not contains .spinner', ()=>{
        expect(doc.getElementsByClassName('spinner').length).to.equal(0)
    })
})