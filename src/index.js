import Module from '../modules'

const insuredPayload = {
  birthday: '1990/12/06',
  gender: 'female',
  ins_amount: 123, // 1,000,000
  ins_payment_period: null, // 躉繳 = null, else 年繳
}
module = new Module('DO1', insuredPayload)

module.get().then((res) => {
  console.log(res)
}, (err) => {
  console.log(err)
})

