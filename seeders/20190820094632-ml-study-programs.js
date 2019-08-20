module.exports = {
  up: queryInterface => queryInterface.bulkInsert(
    'study_programs',
    [
      {
        name: 'Fysikaalisten tieteiden kandiohjelma',
        code: 'KH50_002',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Geotieteiden kandiohjelma',
        code: 'KH50_006',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Kemian kandiohjelma',
        code: 'KH50_003',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Maantieteen kandiohjelma',
        code: 'KH50_007',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Matemaattisten tieteiden kandiohjelma',
        code: 'KH50_001',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Matematiikan, fysiikan ja kemian opettajan kandiohjelma',
        code: 'KH50_004',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Tietojenkäsittelytieteen kandiohjelma',
        code: 'KH50_005',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Bachelor’s Programme in Science',
        code: 'KH50_008',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
    {},
  ),

  down: queryInterface => queryInterface.bulkDelete('study_programs', null, {}),
}
