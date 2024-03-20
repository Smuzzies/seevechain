const moment = require('moment');
const { oneDayAgo } = require('../lib/dateHelpers');
const axios = require('axios'); // Add this line to import axios module
const saveCache = require('./saveCache');


module.exports = async function({ client, block }) {
  const transactionsRecords = await client.query(
    `
      SELECT * FROM transactions
      WHERE block_number = $1;
    `,
    [block.number]
  )

  const transactionIds = transactionsRecords.map(transaction => transaction.id)

  const clauseRecords = transactionIds.length === 0
    ? []
    : await client.query(
      `
        SELECT * FROM CLAUSES
        WHERE transaction_id IN ($1:csv)
      `,
      [transactionIds]
    )

  const clausesByTransactionId = {}
  clauseRecords.forEach(clause => {
    if (!clausesByTransactionId[clause.transaction_id]) clausesByTransactionId[clause.transaction_id] = [clause]
    else clausesByTransactionId[clause.transaction_id].push(clause)
  })

  const before = oneDayAgo()
  const todaysStatsRecord = await client.one(
    `
      SELECT
        sum(transactions.vtho_burn) AS dailyVTHOBurn,
        count(transactions.*) AS dailyTransactions,
        sum(transactions.clauses) AS dailyClauses
      FROM transactions
      WHERE created_at > $1;
    `,
    [before]
  )

  const dailyStatsRecords = await client.query(`SELECT * FROM daily_stats ORDER BY day DESC LIMIT 210`)

  const now = moment()
  const serverTime = now.add((+process.env.TIME_DIFFERENCE), 'hours').format('HH:mm MM/DD/YY')

  const transactionsUsdBurnRecord = await client.one(
    `
      SELECT sum(transactions.vtho_burn_usd) AS usdburn
      FROM transactions
      WHERE created_at > $1;
    `,
    [before]
  )

  const processed = {
    block: {
      id: block.id,
      number: Number(block.number),
    },
    transactions: transactionsRecords.map(transaction => ({
      id: transaction.id,
      blockNumber: Number(transaction.block_number),
      contracts: transaction.contracts,
      origin: transaction.origin,
      gas: Number(transaction.gas),
      clauses: clausesByTransactionId[transaction.id] || [],
      vthoBurn: Number(transaction.vtho_burn),
      gasUsed: Number(transaction.gas_used),
      paid: transaction.paid,
      reward: transaction.reward,
      reverted: transaction.reverted,
    })),
    dailyTotals: {
      dailyTransactions: Number(todaysStatsRecord.dailytransactions),
      dailyClauses: Number(todaysStatsRecord.dailyclauses),
      dailyVTHOBurn: Number(todaysStatsRecord.dailyvthoburn),
    },
    dailyStats: dailyStatsRecords.map(record => ({
      day: moment(record.day).format('YYYY-MM-DD'),
      vthoBurn: record.vtho_burn,
      transactionCount: record.transaction_count,
      clauseCount: record.clause_count,
      vthoBurnUsd: record.vtho_burn_usd,
    })),
    serverTime,
    prices: await getTokenPrices(),
    dailyBurnUsd: transactionsUsdBurnRecord.usdburn,
  }

  await saveCache({
    client,
    cacheName: 'block',
    cache: JSON.stringify(processed),
  })

  return processed
}

async function getTokenPrices() {
  let vetValue, vthoValue;

  // Define API URLs
    const vetApiUrl = 'https://api.vechain.energy/v1/call/main/0x49eC7192BF804Abc289645ca86F1eD01a6C17713/getLatestValue%20(bytes32%200x7665742d75736400000000000000000000000000000000000000000000000000)%20returns%20(uint256%20value,%20uint64%20updatedAt)';
    const vthoApiUrl = 'https://api.vechain.energy/v1/call/main/0x49eC7192BF804Abc289645ca86F1eD01a6C17713/getLatestValue%20(bytes32%200x7674686f2d757364000000000000000000000000000000000000000000000000)%20returns%20(uint256%20value,%20uint64%20updatedAt)?formatEther=true';
  try {
    const [vetResponse, vthoResponse] = await Promise.all([
      axios.get(vetApiUrl),
      axios.get(vthoApiUrl)
    ]);

    // Process VET value: Convert from string to number, move the decimal to the left 6 spaces
    vetValue = parseFloat(vetResponse.data.value) / Math.pow(10, 12);

    // Process VTHO value: Convert from string to number, move the decimal to the left 3 spaces and truncate to 4 decimals
    vthoValue = parseFloat(vthoResponse.data.value) * Math.pow(10, 6); // Move the decimal to the right 6 spaces
    vthoValue = Number.parseFloat(vthoValue.toFixed(6)); // Limit to 6 digits after moving the decimal
  } catch (error) {
    console.error('Error fetching data from the VET and VTHO APIs:', error);
    // Fallback values in case of error
    vetValue = 0;
    vthoValue = 0;
  }

  return {
    vet: vetValue,
    vtho: vthoValue,
  };
}

getTokenPrices().then(prices => {
  console.log("Prices:", prices);
}).catch(error => {
  console.error("Error:", error);
});
