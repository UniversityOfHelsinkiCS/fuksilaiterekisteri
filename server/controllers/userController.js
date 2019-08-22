const db = require('@models')

const getUser = (req, res) => {
  res.send(req.user)
}

const requestDevice = async (req, res) => {
  if (!req.user.eligible) {
    return res
      .status(403)
      .json({ error: 'Not eligible.' })
      .end()
  }
  try {
    const updatedUser = await req.user.update({ wantsDevice: true, personalEmail: req.body.email })

    return res
      .status(200)
      .json({ wantsDevice: updatedUser.wantsDevice, personalEmail: updatedUser.personalEmail })
      .end()
  } catch (error) {
    console.log('Error requesting device: ', error)
    return res
      .status(500)
      .json({ error: 'Database error.' })
      .end()
  }
}

const claimDevice = (req, res) => {
  res.sendStatus(200)
}

const getAllUsers = async (req, res) => {
  try {
    const users = await db.user.findAll({
      attributes: ['name', 'hyEmail', 'studentNumber', 'eligible', 'digiSkillsCompleted', 'deviceGivenAt', 'deviceSerial', 'device_distributed_by', 'id', 'staff', 'distributor'],
    })
    res.json(users)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'error' })
  }
}

const toggleStaff = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) return res.status(400).json({ error: 'user id missing' })

    const user = await db.user.findOne({
      where: {
        id,
      },
      attributes: ['name', 'hyEmail', 'studentNumber', 'eligible', 'digiSkillsCompleted', 'deviceGivenAt', 'deviceSerial', 'device_distributed_by', 'id', 'staff', 'distributor'],
    })

    if (!user) return res.status(404).json({ error: 'user not found' })

    await user.update({ staff: !user.staff })
    return res.json(user)
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'error' })
  }
}

const toggleDistributor = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) return res.status(400).json({ error: 'user id missing' })

    const user = await db.user.findOne({
      where: {
        id,
      },
      attributes: ['name', 'hyEmail', 'studentNumber', 'eligible', 'digiSkillsCompleted', 'deviceGivenAt', 'deviceSerial', 'device_distributed_by', 'id', 'staff', 'distributor'],
    })

    if (!user) return res.status(404).json({ error: 'user not found' })

    await user.update({ distributor: !user.distributor })
    return res.json(user)
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'error' })
  }
}

module.exports = {
  getUser,
  requestDevice,
  claimDevice,
  getAllUsers,
  toggleStaff,
  toggleDistributor,
}
