import { GithubUser } from "./GithubUser.js"

// classe que vai conter a lógica dos dados
// como os dados serão estruturados
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()

  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {

      const userExists = this.entries.find(entry => entry.login === username)

      if(userExists) {
        throw new Error('Usuário já cadastrado')
      }
    
      const user = await GithubUser.search(username)

      if(user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]

      this.update()
      this.save()
      this.onAddLine()

    } catch(error) {
      alert(error.message)
    }
  }

      //Higher-order functions (map, filter, find, reduce)
  delete(user){
    const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

    this.entries = filteredEntries
    this.update()
    this.save()
    this.onAddLine()

  }
}

const emptyTable = document.querySelector('.empty-table')

// classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onadd()
    this.onAddLine()
  }


  update() {
    this.removeAllTr()

    this.entries.forEach( user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar essa linha?')
        if(isOk) {
          this.delete(user)
        }
      }


      this.tbody.append(row)
    })
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
    <td class="user">
      <img src="https://github.com/ValadaoLucas.png" alt="Imagem de Lucas Valadão">
      <a href="https://github.com/ValadaoLucas" target="_blank">
        <p>Lucas Valadão</p>
        <span>ValadaoLucas</span>
      </a>
    </td>
    <td class="repositories">
      16
    </td>
    <td class="followers">
      0
    </td>
    <td>
      <button class="remove">Remover</button>
    </td>
  `

  return tr
}


  removeAllTr() {
      this.tbody.querySelectorAll('tr').forEach((tr) => {
        tr.remove()
  
      })
    }

    onadd() {
      const addButton = this.root.querySelector('.search button')

      window.document.onkeyup = (event) => {
        if(event.key === "Enter"){ 
          const { value } = this.root.querySelector('.search input')
          
          this.add(value)
        }
      }

      addButton.onclick = () => {
        const { value } = this.root.querySelector('.search input')
  
        this.add(value)
      }          
    }
  
    onAddLine() {
      if(localStorage.getItem("@github-favorites:") == "[]") {
        this.root.querySelector('.empty-table').classList.remove('hide')
      } else {
        this.root.querySelector('.empty-table').classList.add('hide')
      }
    }    
  
  }

