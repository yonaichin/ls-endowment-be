import Module from '../modules'

const insuredPayload = {
  birthday: '1990/12/06',
  gender: 'male',
  ins_amount: 20, // 1,000,000
  ins_payment_period: null, // 躉繳 = null, else 年繳
}
const dollarPayload = {
  birthday: '1991/12/06',
  gender: 'female',
  ins_amount: 3500, // 1,000,000
  ins_payment_period: 6, // 躉繳 = null, else 年繳
}
const moduleDO1 = new Module('DO1', insuredPayload)
const moduleDR1 = new Module('DR1', insuredPayload)
const moduleZJ1 = new Module('ZJ1', dollarPayload)

// Promise.all([ moduleDO1.get(),
//               moduleDR1.get()
//               ])
//         .then((res) => {
//   const [m_do1, m_dr1] = res
//   console.log(m_dr1)
//
// })
//   .catch((err) => {
//     console.log('promise all error', err)
//   })



moduleZJ1.get().then((res) => {
  console.log(res)
}, (err) => {
  console.log(err)
})

