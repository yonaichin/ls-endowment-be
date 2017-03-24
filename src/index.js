import Module from '../modules'

module = new Module('DO1')

module.get().then((res) => {
  console.log(res)
})

