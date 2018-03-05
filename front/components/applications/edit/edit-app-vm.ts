import * as ko from 'knockout'
import state from '../../state'

class EditApp {
  modalActive = ko.observable(false)

  name = ko.observable('')
  repository = ko.observable('')
  username = ko.observable('')
  key = ko.observable('')
  password = ko.observable('')
  label = ko.observable('')
  dockerfile = ko.observable('')
  autoBuild = ko.observable(false)
  originalApp: Concierge.Application = {} as any
  credentials = ko.computed(() => {
    return [{ id: 0, name: 'None', username: '', key: '' }, ...state.credentials()]
  })

  selectedCredentials = ko.observable(this.credentials()[0])

  constructor() {
    this.password.subscribe(pwd => {
      if (pwd.length > 0 && this.key().length > 0) {
        this.key('')
      }
    })

    this.key.subscribe(key => {
      if (key.length > 0 && this.password().length > 0) {
        this.password('')
      }
    })
  }

  editApplication = (app: Concierge.Application) => {
    this.originalApp = app
    this.repository(app.repository)
    this.dockerfile(app.dockerfile)
    this.name(app.name)
    this.username(app.username)
    this.autoBuild(!!app.autoBuild)
    this.password('')
    this.key('')
    this.label(app.label)

    const creds = state.credentials().find(cred => cred.id === app.credentialsId)
    this.selectedCredentials(creds || this.credentials()[0])
    this.modalActive(true)
  }

  hideModal = () => {
    this.modalActive(false)
  }

  saveApplication = async () => {
    const body = {
      repository: this.repository(),
      name: this.name(),
      username: this.username(),
      key: this.password() || this.key(),
      label: this.label(),
      dockerfile: this.dockerfile(),
      credentialsId: this.selectedCredentials().id,
      autoBuild: this.autoBuild()
    }

    const keys = Object.keys(body) as Array<keyof typeof body>
    for (const key of keys) {
      const original = this.originalApp[key]
      const modified = body[key]
      if (original === modified) {
        delete body[key]
      }
    }

    const result = await fetch(`/api/applications/${this.originalApp.id}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (result.status === 200) {
      state.getApplications()
      state.toast.success('Successfully updated application')
      this.hideModal()
      return
    }
    const error = await result.json()
    state.toast.error(`Failed to updated application: ${error.message}`)
  }
}

const viewModel = new EditApp()

ko.components.register('ko-edit-application', {
  template: require('./edit-app.html'),
  viewModel: {
    createViewModel: () => viewModel
  }
})

export default viewModel
