const axios = require('axios');

async function fetchQuickSwapData() {

    const query = {
        factories(first: 5) {
          id
          poolCount
          txCount
          totalVolumeUSD
        }
        bundles(first: 5, where: {}) {
          id
          maticPriceUSD
        }
        tokenHourDatas
      }
}
try {
    const response = await axios.post{https://gateway.thegraph.com/api/[api-key]/subgraphs/id/FqsRcH1XqSjqVx9GRTvEJe959aCbKrcyGgDWBrUkG24g'}
    
        return response.data.data.QuickSwapDatas;
} catch (error) {
    
}

async function fetchLlamaInsights() {}
async function runApp() {}

