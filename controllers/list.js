import Module from '../modules'

import { HTTPLogger } from '../utils'

export const postList = (req, res) => {
  HTTPLogger(req)
  const moduleDO1 = new Module('DO1')
  moduleDO1.get().then((m) => {
    res.status(200).json(m)
  })
}
