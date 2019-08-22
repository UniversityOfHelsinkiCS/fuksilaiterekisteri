const db = require('@models')

const getUser = (req, res) => {
  res.send(req.user)
}

const requestDevice = (req, res) => {
  res.sendStatus(200)
}

const claimDevice = async (req, res) => {
  try {
    const { user, body: { studentNumber, deviceId } } = req

    if (!studentNumber) return res.status(400).json({ error: 'student number missing' })
    if (!deviceId) return res.status(400).json({ error: 'device id missing' })

    const student = await db.user.findOne({
      where: {
        studentNumber,
      },
    })

    if (!student) return res.status(404).json({ error: 'student not found' })

    if (!(student.eligible && student.wantsDevice && student.digiSkillsCompleted && student.courseRegistrationCompleted)) {
      return res.status(403).json({ error: 'student not egilible for device' })
    }

    const deviceData = {
      device_distributed_by: user.hyEmail,
      deviceSerial: deviceId,
      deviceGivenAt: new Date(),
    }

    await student.update({
      ...deviceData,
    })

    return res.json(deviceData)
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'error' })
  }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await db.user.findAll()
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
