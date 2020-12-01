import BurnTxsAndClausesCharts from 'components/BurnTxsAndClausesCharts'
import TopContractsChart from 'components/TopContractsChart'
import BurnMovingAverageChart from 'components/BurnMovingAverageChart'
import UsdVthoBurnChart from 'components/UsdVthoBurnChart'

export const locationToChartMap = {
  '/contracts': {
    title: 'Today\'s Top Contracts',
    component: TopContractsChart,
  },
  '/burn': {
    title: 'VTHO Burn, Clauses & Txs',
    component: BurnTxsAndClausesCharts,
  },
  '/burn-moving-averages': {
    title: 'VTHO Burn Moving Averages',
    component: BurnMovingAverageChart,
  },
  '/burn-usd': {
    title: 'USD VTHO Burn',
    component: UsdVthoBurnChart,
  }
}

export const colorSet = [
  '#2f4b7c',
  '#f95d6a',
  '#665191',
  '#ffa600',
  '#488f31',
  '#a05195',
  '#ff7c43',
  '#d45087',
  '#8ba741',
  '#e4ca6f',
  '#f17758',
  '#6b9b38',
  '#aab34e',
  '#c7be5d',
  '#ffd582',
  '#fdbf71',
  '#fba764',
  '#f7905c',
  '#e95d58',
  '#de425b',
]

export const colorSet2 = [
  '#ffa600',
  '#459FA1',
  '#654D66',
  '#F0EE71',
  '#5E3A4A',
  '#4F889A',
  '#624358',
  '#D3E874',
  '#645873',
  '#4EB69D',
  '#62647F',
  '#B7E27A',
  '#5D6F8A',
  '#46ABA0',
  '#577C94',
  '#9CDB81',
  '#49949F',
  '#84D389',
  '#5CC098',
  '#6ECA91',
]

// http://tristen.ca/hcl-picker/#/hlc/20/1.05/EB82A4/E38953
export const colorSet3 = [
  '#2CB2B7',
  '#EB82A4',
  '#D79147',
  '#DD88B4',
  '#63B26E',
  '#CB8FC2',
  '#C79940',
  '#B497CC',
  '#28B4A7',
  '#9A9ED2',
  '#E38953',
  '#7DA5D2',
  '#B6A03E',
  '#60ABCE',
  '#A2A643',
  '#43AFC5',
  '#8EAB4E',
  '#37B494',
  '#78AF5C',
  '#4CB481',
]
