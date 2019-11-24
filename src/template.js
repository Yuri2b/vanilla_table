export default function appTemplate(state, columns){
    const columnNames = columns || ['id', 'name', 'surname', 'email', 'phone']
    const tableRowsTemplate = (state) => {
     return  state.items().map(el => 
        `<tr data-app-item-id=${el.id}>
          ${columnNames.map( clmn => {
            return `<th>${el[clmn]}</th>` 
          }).join('')}
        </tr>`).join('')
    }

    const paginationTemplate = (state) => {
      let pages = []
      for(let i=1;i<=state.pagesCount();i++){
        pages.push(i == state.currentPage() ? `<li class="uk-active"><span>${i}</span></li>` : `<li><a href="#" data-app-set-page=${i}>${i}</a></li>`)
      }  
      return `
        <div class="pagination-wrapper">
          <ul class="uk-pagination uk-flex-center">
            ${pages.join('')}
          </ul>
        </div>`
    }
    
    const itemCardTemplate = (state) => {
      const customer = state.activeCustomer()
      return state.activeItemId() ?
       `<div class="item-wrapper uk-flex uk-flex-center@m">
          <div class="uk-card uk-card-default uk-card-body uk-width-1-2@m">
            <p class="uk-card-title">Пользователь ${customer.name} ${customer.surname}</p>
            <span>Описание:</span>
            <p class="uk-text-emphasis uk-margin-remove-top">${customer.description}</p>
            <p><span>Адрес проживания: </span><span class="uk-text-bold uk-display-block">${customer.streetAddress}</span></p>
            <p>Город: <span class="uk-text-bold uk-display-block">${customer.city}</span></p>
            <p>Провинция/Штат: <span class="uk-text-bold uk-display-block">${customer.state}</span></p>
            <p>Индекс: <span class="uk-text-bold uk-display-block">${customer.zip}</span></p>
          </div>
        </div>`
        : ''
    }

    const alertTemplate = (state) =>
      `<div class="alert-wrapper uk-alert uk-alert-danger uk-margin-large">
        <p class="uk-margin-remove">Во время загрузки данных произошла ошибка:</p>
        <span class="uk-text-small">${state.lastError()}</span>
      </div>`

    return `
      <div class="main-wrapper">
        <div class="search-box uk-margin-left">
          <input id="searchInput" class="uk-input uk-form-width-medium uk-form-small" type="text" name="search" value="${state.searchQuery()}" placeholder="что искать..">
          <button id="searchButton" class="uk-button uk-button-default uk-button-small">найти</button>
          <p>Всего записей: ${state.totalItemsCount()}</p>    
        </div>
        ${paginationTemplate(state)}
        <div class="table-wrapper">
          <table class="uk-table uk-table-stripped uk-table-hover uk-table-divider uk-table-responsive">
            <thead>
              <tr>
                ${columnNames.map(clmn =>{
                  return `<th data-app-column="${clmn}">${clmn}${state.orderBy().column == clmn ? `<span class="arrow ${state.orderBy().order}"></span>` : ``}</th>`
                }).join('')}
              </tr>
            </thead>
            <tbody>
              ${tableRowsTemplate(state)}
            </tbody>
          </table>
          ${state.isLoading() ? `<div class="spinner"></div>` : ''}
          ${state.isFailed() ? alertTemplate(state) : ''}    
        </div>  
        ${itemCardTemplate(state)}
      </div>`
  }