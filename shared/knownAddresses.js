//addresses must be lowercase//

const KNOWN_CONTRACTS = { 
  '0xb81e9c5f9644dec9e5e3cac86b4461a222072302': 'VeChain Node',
  '0xe28ce32d637eb93cbda105f87fbb829e9ef8540b': 'VeChain Auction',
  '0xdbaec4165a6cff07901c41d3561eefdcfbc20cb6': 'Steering Committee Vote',
  '0x0000000000000000000000417574686f72697479': 'VeChain Authority Node',
  '0xa6416a72f816d3a69f33d0814700545c8e3fe4be': {
    short: 'VeChain Foundation',
    long: 'VeVote Contract',
  },
    '0x102a7b7f771d904034471431b2f67e661f1bab1e': {
    short: 'VeBetterDAO',
    long: 'B3TR Governor',
  },
    '0x27a36c16734cf11eda1bcc1dc78c1ee25d9df7ed': {
    short: 'VeBetterDAO',
    long: 'Timelock',
  },
    '0x61fe12d6218f2aa4be527e38aac2fac6b529b6b6': {
    short: 'VeBetterDAO',
    long: 'X-Allocation Pool',
  },
    '0x90c1a329e11ce6429eef0ab9b8f7daab68694e7d': {
    short: 'VeBetterDAO',
    long: 'X-Allocation Voting',
  },
    '0x3d7616213191a10460e49cfdb7edbf88d6a10942': {
    short: 'VeBetterDAO',
    long: 'Emissions',
    },
    '0x2d0eff77e390cff063e0567a7735c904cbc4d1cf': {
    short: 'VeBetterDAO',
    long: 'Voter Rewards',
    },
    '0xa9ac49c030c1148b95f056e86f2531f8f3d5bf27': {
    short: 'VeBetterDAO',
    long: 'Galaxy Membership (GM) NFT',
    },
  '0xc208632f2054b909cc1898f10b5d3d7cab459371': {
    short: 'Mugshot.vet',
    long: 'Mugshot.vet',
  },
  '0xe3fe6464bbc8c1d44e0bfd32bb1f0ff00318a3e0': {
    short: 'Cleanify.vet',
    long: 'Cleanify Campaigns',
  },
  '0x8727333244e1312fdb2f750579d3c6c07bc6012c': {
    short: 'Cleanify.vet',
    long: 'Cleanify Dailys',
  },
  '0xb49a6333d5c9d499f225b537c304badfbdb5099c': {
    short: 'NFBookClub',
    long: 'NFBC 1',
  },
  '0xe31d6c0b8fcf96696a55ef77dd03a16dea8faa48': {
    short: 'NFBookClub',
    long: 'NFBC 2',
  },
}
    
const TOKEN_CONTRACTS = {
  '0x0000000000000000000000000000456e65726779': 'VTHO Token',
  '0xac0ca2a5148e15ef913f9f5cf8eb3cf763f5a43f': 'B3TR Token',
  '0x9df69ad8ff89063869e04164a11579c0a8532e84': 'VOT3 Token',
}

const KNOWN_ADDRESSES = {
  '0xac0ca2a5148e15ef913f9f5cf8eb3cf763f5a43f': 'B3TR Token',
}

function getKnownContract(address, shortOrLong) {
  if (!KNOWN_CONTRACTS[address]) {
    getVetNameForAddress(address)
      .catch(() => { /* ignore */ })
    return
  }

  return typeof KNOWN_CONTRACTS[address] === 'string'
    ? KNOWN_CONTRACTS[address]
    : KNOWN_CONTRACTS[address][shortOrLong]
}

function getShortKnownContract(address) {
  return getKnownContract(address, 'short')
}

function getLongKnownContract(address) {
  return getKnownContract(address, 'long')
}


function getKnownAddress (address) {
  if(KNOWN_ADDRESSES[address]) {
    return KNOWN_ADDRESSES[address]
  }

  getVetNameForAddress(address)
    .catch(() => { /* ignore */ })
}

const fetchedVetAddresses = new Set()
async function getVetNameForAddress(address) {
  // fetch every address only once
  if (fetchedVetAddresses.has(address)) { return }
  fetchedVetAddresses.add(address)

  // read name for address
  try {
    const [name] = await fetch('https://api.vechain.energy/v1/call/main', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        "clauses": [
          {
            "to": "0xA11413086e163e41901bb81fdc5617c975Fa5a1A",
            "abi": {
              "inputs": [
                { "internalType": "address[]", "name": "addresses", "type": "address[]" }
              ],
              "name": "getNames",
              "outputs": [
                { "internalType": "string[]", "name": "names", "type": "string[]" }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            "args": [
              [address]
            ]
          }
        ]
      })
    }).then(res => res.json())
    if (!name) { return }

    // extract tld from name, for exmaple vtho.swap.energy.vet => energy.vet
    const tld = name.split('.').slice(-2).join('.')

    // store in results KNOWN_CONTRACTS
    KNOWN_ADDRESSES[address] = name
    KNOWN_CONTRACTS[address] = {
      short: tld,
      long: name
    }
  }

  // just ignore errors, we can re-fetch on next start
  catch {
    return
  }
}

const PRETTY_KNOWN_CONTRACTS = {}
for (let key in KNOWN_CONTRACTS) {
  const cur = KNOWN_CONTRACTS[key]
  PRETTY_KNOWN_CONTRACTS[key] = typeof cur === 'string'
    ? cur
    : cur.long
}

module.exports = {
  getShortKnownContract,
  getLongKnownContract,
  getKnownAddress,
  KNOWN_CONTRACTS,
  KNOWN_ADDRESSES,
  TOKEN_CONTRACTS,
  PRETTY_KNOWN_CONTRACTS,
}
