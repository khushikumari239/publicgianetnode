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
            'https://gateway.thegraph.com/api/a1a5702ed0c3482b12b61abf53676c33/subgraphs/id/FqsRcH1XqSjqVx9GRTvEJe959aCbKrcyGgDWBrUkG24g',
            { query }
        );
        if (!response.data || !response.data.data) {
            throw new Error('Invalid response format');
        }
        return response.data.data;
    } catch (error) {
        console.error('Error fetching QuickSwap data:', error.message);
        return null;
    }
}

function formatLlamaInsights(data) {
    if (!data || !data.factories || !Array.isArray(data.factories)) {
        return "No factory data available.";
    }
    return data.factories.map(d => 
        `ID ${d.id} - poolCount ${d.poolCount} - Transaction txtCount ${d.txCount} - tracked totalVolumeUSD ${d.totalVolumeUSD}`
    ).join('\n');
}

const questions = [
    { id: 1, text: "Show all QuickSwap data" },
    { id: 2, text: "How many factories are there?" },
    { id: 3, text: "What's the total volume across all factories?" },
    { id: 4, text: "What's the current MATIC price?" },
    { id: 5, text: "How many pools are there in total?" },
    { id: 6, text: "What's the total transaction count?" },
    { id: 7, text: "Exit" }
];

async function chatbot() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log("Welcome to the QuickSwap Chatbot!");

    const askQuestion = async () => {
        console.log("\nWhat would you like to know about QuickSwap data?");
        questions.forEach(q => console.log(`${q.id}. ${q.text}`));

        const answer = await new Promise(resolve => {
            rl.question("Enter the number of your choice: ", resolve);
        });

        if (answer === '7') {
            console.log("Thank you for using the QuickSwap Chatbot. Goodbye!");
            rl.close();
            return;
        }

        const data = await fetchQuickSwapData();

        if (!data) {
            console.log("Unable to fetch QuickSwap data. Please check your API key and network connection.");
            await askQuestion();
            return;
        }

        switch(answer) {
            case '1':
                console.log("Here's the QuickSwap data:");
                console.log(formatLlamaInsights(data));
                break;
            case '2':
                console.log(`Number of factories: ${data.factories ? data.factories.length : 'Data unavailable'}`);
                break;
            case '3':
                if (data.factories) {
                    const totalVolume = data.factories.reduce((sum, factory) => sum + parseFloat(factory.totalVolumeUSD), 0);
                    console.log(`Total volume across all factories: $${totalVolume.toFixed(2)} USD`);
                } else {
                    console.log("Total volume data unavailable.");
                }
                break;
            case '4':
                if (data.bundles && data.bundles.length > 0) {
                    console.log(`Current MATIC price: $${data.bundles[0].maticPriceUSD} USD`);
                } else {
                    console.log("MATIC price data not available.");
                }
                break;
            case '5':
                if (data.factories) {
                    const totalPools = data.factories.reduce((sum, factory) => sum + parseInt(factory.poolCount), 0);
                    console.log(`Total number of pools: ${totalPools}`);
                } else {
                    console.log("Pool count data unavailable.");
                }
                break;
            case '6':
                if (data.factories) {
                    const totalTx = data.factories.reduce((sum, factory) => sum + parseInt(factory.txCount), 0);
                    console.log(`Total transaction count: ${totalTx}`);
                } else {
                    console.log("Transaction count data unavailable.");
                }
                break;
            default:
                console.log("Invalid choice. Please select a number from the list.");
        }

        await askQuestion();
    };

    await askQuestion();
}

async function runApp() {
    console.log("Starting QuickSwap Chatbot...");
    await chatbot();
}

runApp();