const bigNumber = require('bignumber.js')
const { ABI_SIGNATURES } = require('../lib/abiSignatures')
const { TOKEN_CONTRACTS, KNOWN_CONTRACTS } = require('../../shared/knownAddresses')
const { abi } = require('thor-devkit')
const knex = require ('../database/knex')

module.exports = async function({ client, transaction, block, receipt }) {

  const vthoBurn = ((receipt.gasUsed + (receipt.gasUsed * ((transaction.gasPriceCoef || 0) / 255))) / 1000) * .7

  await client.query(
    `
      INSERT INTO
        transactions (
          id,
          block_number,
          origin,
          delegator,
          gas,
          vtho_burn,
          gas_used,
          paid,
          reward,
          clauses,
          reverted
        )
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO UPDATE
        SET
          block_number = EXCLUDED.block_number,
          origin = EXCLUDED.origin,
          delegator = EXCLUDED.delegator,
          gas = EXCLUDED.gas,
          vtho_burn = EXCLUDED.vtho_burn,
          gas_used = EXCLUDED.gas_used,
          paid = EXCLUDED.paid,
          reward = EXCLUDED.reward,
          clauses = EXCLUDED.clauses,
          reverted = EXCLUDED.reverted
    `,
    [
      transaction.id,
      block.number,
      transaction.origin,
      transaction.delegator,
      transaction.gas,
      vthoBurn,
      receipt.gasUsed,
      receipt.paid,
      receipt.reward,
      transaction.clauses.length,
      receipt.reverted,
    ]
  )

  const insertableClauses = []
  for (const { contractAddress, events, transfers } of receipt.outputs) {
    const clause = { transaction_id: transaction.id }
    if (contractAddress) {
      clause.contract = contractAddress
      clause.type = 'New Contract'
      insertableClauses.push(clause)
      continue
    }

    const event = events[events.length - 1]
    const transfer = transfers[0]

    if (event) {
      if (TOKEN_CONTRACTS[event.address]) {
        const clauseMatchingEvent = transaction.clauses.find(clause => {
          if (!clause.data) return false
          return clause.data.indexOf(event.data.slice(2)) !== -1
        })
        if (clauseMatchingEvent) {
          const signature = clauseMatchingEvent.data.slice(0, 10)
          if (ABI_SIGNATURES[signature]) {
            const decoded = abi.decodeParameters(
              ABI_SIGNATURES[signature],
              '0x' + clauseMatchingEvent.data.slice(10)
            )
            if (decoded) {
              clause.type = 'Transfer'
              clause.transfer_recipient = decoded._to
              clause.transfer_sender = transaction.origin
              clause.transfer_token = TOKEN_CONTRACTS[event.address].replace(' Token', '')
              clause.transfer_amount = Number(
                new bigNumber(decoded._amount).dividedBy(Math.pow(10, 18)).toFixed(2)
              )
              clause.contract = event.address
              insertableClauses.push(clause)
              continue
            }
          }
        }
      }

      clause.type = 'Data'
      clause.contract = event.address
      insertableClauses.push(clause)
      continue
    }

    if (transfer) {
      clause.type = 'Transfer'
      clause.transfer_recipient = transfer.recipient
      clause.transfer_sender = transfer.sender
      clause.transfer_token = 'VET'
      clause.transfer_amount = Number(
        new bigNumber(transfer.amount, 16).dividedBy(Math.pow(10, 18)).toFixed(2)
      )
      insertableClauses.push(clause)
    }
  }

  if (insertableClauses.length === 0) {
    transaction.clauses.forEach(clause => {
      if (clause.to && clause.data !== '0x') {
        const insertableClause = { transaction_id: transaction.id }
        insertableClause.type = 'Data'
        insertableClause.contract = clause.to
        insertableClause.reverted = true
        insertableClauses.push(insertableClause)
      }
    })
  }

  if (insertableClauses.length > 0) {
    await client.query(`DELETE FROM clauses WHERE transaction_id = $1`, [transaction.id])
    await client.query(`${knex('clauses').insert(insertableClauses)}`)
  }
}
