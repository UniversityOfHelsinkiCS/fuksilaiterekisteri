const deviceModels = {
  2019: 'Thinkpad T490',
  2020: 'Thinkpad T490',
  2021: 'Thinkpad T14 gen 2',
  2022: 'Thinkpad T14 gen 2',
  2023: 'Thinkpad L14 gen 3',
}

const deviceModelColumn = {
  key: 'device_model',
  label: 'Device model',
  renderCell: ({ deviceGivenAt }) => {
    if (!deviceGivenAt) return '-'
    const model = deviceModels[new Date(deviceGivenAt).getFullYear()]
    if (!model) return 'Not found'
    return model
  },
}

export default deviceModelColumn
