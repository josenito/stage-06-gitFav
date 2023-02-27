import { GithubUser } from "./GithubUser.js"

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
    this.checkRecordsExistence()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  checkRecordsExistence() {
    const screenEmpty = this.root.querySelector('.noContent')
    const isEmpty = this.entries.length === 0

    isEmpty ? this.showScreenEmpty(screenEmpty) : this.hideScreenEmpty(screenEmpty)
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }


  async add(username) {
    try {
      const userExists = this.entries.find(entry => entry.login === username)

      if (userExists) {
        throw new Error('Usuário já cadastrado')
      }

      const user = await GithubUser.search(username)

      if (user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()
      this.checkRecordsExistence()

    } catch (error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

    this.entries = filteredEntries
    this.update()
    this.save()
    this.checkRecordsExistence()
  }
}





export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector('.entry button')

    addButton.onclick = () => {
      const { value } = this.root.querySelector('.entry input')

      this.add(value)
    }
  }

  showScreenEmpty(screenEmpty) {
    screenEmpty.classList.remove('hide')
  }

  hideScreenEmpty(screenEmpty) {
    screenEmpty.classList.add('hide')
  }

  update() {
    this.removeAllTr()

    this.entries.forEach(user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar esse favorito?')
        if (isOk) {
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
        <img src="" alt="">
        <a href="" target="_blank">
          <p></p>
          <span></span>
        </a>
      </td>
      <td class="repositories"></td>
      <td class="followers"></td>
      <td>
        <button class="remove">Remover</button>
      </td>
    `
    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr')
      .forEach((tr) => {
        tr.remove()
        tr.r
      })
  }

}