const moment = require('moment')

module.exports = async function({ client, block }) {
  try {
    await client.query(
      `
        INSERT INTO
          blocks (id, number, parent_id, timestamp, gas_used, signer, number_of_transactions)
        values
          ($1, $2, $3, $4, $5, $6, $7)
      `,
      [
        block.id,
        block.number,
        block.parentID,
        moment.unix(block.timestamp).toDate().toISOString(),
        block.gasUsed,
        block.signer,
        block.transactions.length,
      ]
    )
  } catch(error) {
    console.log(error)
  }
}
