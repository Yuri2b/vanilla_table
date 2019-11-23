import './css/style.scss'
import App from './app'

const url = 'http://www.filltext.com/?rows=100&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&adress=%7BaddressObject%7D&description=%7Blorem%7C32%7D'
const dataSource = new Request(url)
const columns = ['id', 'name', 'surname', 'email', 'phone']

const app = new App(dataSource, columns)

app.mount('app')
