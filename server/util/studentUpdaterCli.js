require('module-alias/register')
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
})
const { checkStudentEligibilities, updateStudentEligibility, updateEligibleStudentStatuses } = require('../services/student')

const commands = {
  0: {
    info: 'Exit',
    exec: () => process.exit(0),
  },
  1: {
    info: 'Check student eligibilities',
    exec: async () => {
      console.log('Checking student eligibilies...')
      await checkStudentEligibilities()
    },
  },
  2: {
    info: 'Update student eligibility',
    exec: () => new Promise((res) => {
      rl.question('Student number: ', async (studentNumber) => {
        await updateStudentEligibility(studentNumber)
        res()
      })
    }),
  },
  3: {
    info: 'Update eligible student statuses',
    exec: async () => {
      console.log('Updating eligible student statuses...')
      await updateEligibleStudentStatuses()
    }
  }
}

const printInsturctions = () => {
  console.log('command\t\tdescription')
  console.log('-------\t\t------------')
  Object.entries(commands).forEach(([command, { info }]) => {
    console.log(`${command}\t\t${info}`)
  })
  console.log('')
}

const loop = () => {
  printInsturctions()
  rl.question('Select command: ', async (command) => {
    if (Object.keys(commands).includes(command)) await commands[command].exec()
    else console.log(`Command ${command} doesn't exist!`)
    console.log('\n')
    loop()
  })
}

loop()
