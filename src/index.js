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
  ins_amount: 5000, // 1,000,000
  ins_payment_period: null, // 躉繳 = null, else 年繳
}
const moduleDO1 = new Module('A06_DO1', insuredPayload)
const moduleDR1 = new Module('A06_DR1', insuredPayload)

const moduleZJ1 = new Module('A06_ZJ1', dollarPayload)
const moduleA03_FAS = new Module('A03_FAS', dollarPayload)

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



moduleA03_FAS.get().then((res) => {
  console.log(res)
}, (err) => {
  console.log(err)
})

