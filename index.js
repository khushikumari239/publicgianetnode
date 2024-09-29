const axios = require('axios');
const readline = require('readline');

async function fetchQuickSwapData() {
    const query = `{
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
    }`;

    try {
        const response = await axios.post(
            'https://gateway.thegraph.com/api/[api-key]/subgraphs/id/FqsRcH1XqSjqVx9GRTvEJe959aCbKrcyGgDWBrUkG24g',
            { query }
        );
        return response.data.data;
    } catch (error) {
        console.error('Error fetching QuickSwap data:', error);
        return [];
    }
}

function formatLlamaInsights(data) {
    return data.factories.map(d => 
        `ID ${d.id} - poolCount ${d.poolCount} - Transaction txtCount ${d.txCount} - tracked totalVolumeUSD ${d.totalVolumeUSD}`
    ).join('\n');
}

async function chatbot() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log("Welcome to the QuickSwap Chatbot! Type 'exit' to quit.");

    const askQuestion = () => {
        rl.question("What would you like to know about QuickSwap data? ", async (answer) => {
            if (answer.toLowerCase() === 'exit') {
                rl.close();
                return;
            }

            const data = await fetchQuickSwapData();
            const insights = formatLlamaInsights(data);

            switch(answer.toLowerCase()) {
                case 'show data':
                    console.log("Here's the QuickSwap data:");
                    console.log(insights);
                    break;
                case 'factory count':
                    console.log(`Number of factories: ${data.factories.length}`);
                    break;
                case 'total volume':
                    const totalVolume = data.factories.reduce((sum, factory) => sum + parseFloat(factory.totalVolumeUSD), 0);
                    console.log(`Total volume across all factories: $${totalVolume.toFixed(2)} USD`);
                    break;
                case 'matic price':
                    if (data.bundles && data.bundles.length > 0) {
                        console.log(`Current MATIC price: $${data.bundles[0].maticPriceUSD} USD`);
                    } else {
                        console.log("MATIC price data not available.");
                    }
                    break;
                default:
                    console.log("I'm not sure how to answer that. Try 'show data', 'factory count', 'total volume', or 'matic price'.");
            }

            askQuestion();
        });
    };

    askQuestion();
}

async function runApp() {
    console.log("Starting QuickSwap Chatbot...");
    await chatbot();
}

runApp();