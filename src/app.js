import State from './state'
import appTemplate from './template'

export default function App(dataSource, columns){
  
// render function //////////////////////
  const render = (mountPoint) => {
    return function(state){
      mountPoint.innerHTML = appTemplate(state, columns)
    }
  }

  this.mount = rootId => {
  // initial entities //////////////
    const mountPoint = document.getElementById(rootId)
    const initState = new State()
    const renderApp = render(mountPoint)

  // initial render ////////////////
    initState.actionLoadData(dataSource, renderApp)

  // mounted routine ///////////////////  
    mountPoint.addEventListener('click', ({target}) => {
      if(target.dataset['appSetPage']){
        const newPage = target.dataset['appSetPage']
        initState.actionSetPage(newPage, renderApp)
      }
      else if(target.dataset['appItemId'] || (target.tagName == 'TD' && target.parentNode.dataset['appItemId'])){
        const newActiveItemId = target.parentNode.dataset['appItemId']
        initState.actionSetActiveItemId(newActiveItemId, renderApp)
      }
      else if(target.id == 'searchButton'){
        const searchQuery = mountPoint.querySelector('#searchInput').value
        initState.actionSetSearchQuery(searchQuery, renderApp)
      }
      else if(target.dataset['appColumn']){
        const columnToOrder = target.dataset['appColumn']
        initState.actionSetOrder(columnToOrder, renderApp)
      }
    })
  }
}
