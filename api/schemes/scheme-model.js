const db = require('../../data/db-config.js');

//EXERCISE A
function find() {
  return db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .select('sc.*')
    .count('st.step_id as number_of_steps')
    .groupBy('sc.scheme_id');
}

//EXERCISE B
async function findById(scheme_id) {
  const rows = await db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .where('sc.scheme_id', 'scheme_id')
    .select('st.*', 'sc.scheme_name', 'sc.scheme_id')
    .orderBy('st.step_number');

  const result = {
    scheme_id: rows[0].scheme_id,
    scheme_name: rows[0].scheme_name,
    steps: [],
  };
  rows.forEach((row) => {
    if (row.step_id) {
      result.steps.push({
        step_id: row.step_id,
        step_number: row.step_number,
        instructions: row.instructions,
      });
    }
  });
  return result;
}

//EXERCISE C
async function findSteps(scheme_id) {
  const rows = await db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .select('st.step_id', 'st.step_number', 'instructions', 'sc.scheme_id')
    .where('sc.scheme_id', scheme_id)
    .orderBy('step_number');

  if (!row[0].step_id) return [];
  return rows;
}

//EXERCISE D
function add(scheme) {
  return db('schemes')
    .insert(scheme)
    .then(([id]) => {
      return db('schemes').where('scheme_id', scheme_id).first();
    });
}

//EXERCISE E
function addStep(scheme_id, step) {
  return db('steps')
    .insert({
      ...step,
      scheme_id,
    })
    .then(() => {
      return db('steps')
        .join('schemes as sc', 'sc.scheme_id', 'st.scheme_id')
        .select('step_id', 'step_number', 'instructions', 'scheme_name')
        .orderBy('step_number')
        .where('scheme_id', scheme_id);
    });
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
};
