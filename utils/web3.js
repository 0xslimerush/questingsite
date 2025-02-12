const ALCHEMY_API_KEY = 'your_alchemy_api_key'; // Replace with your Alchemy API key
const ALCHEMY_NETWORK = 'monad-testnet'; // Replace with actual network name when available

const contractABIs = {
    questRegistry: [
        "event QuestCompleted(address indexed user, uint256 indexed questId, uint256 points)",
        "function optInForQuest(uint256 questId) external",
        "function isOptedIn(address user, uint256 questId) external view returns (bool)",
        "function getQuestProgress(address user, uint256 questId) external view returns (uint256)",
        "function syncProgress(address user, uint256 questId) external"
    ]
};

async function createAlchemyProvider() {
    try {
        return new ethers.providers.AlchemyProvider(ALCHEMY_NETWORK, ALCHEMY_API_KEY);
    } catch (error) {
        reportError(error);
        throw error;
    }
}

async function listenToQuestEvents(contractAddress, questId, userAddress, onCompletion) {
    try {
        const provider = await createAlchemyProvider();
        const contract = new ethers.Contract(contractAddress, contractABIs.questRegistry, provider);

        // Create filter for specific user and quest
        const filter = contract.filters.QuestCompleted(userAddress, questId);

        // Listen for real-time events
        contract.on(filter, async (user, qId, points) => {
            if (user.toLowerCase() === userAddress.toLowerCase() && qId.toString() === questId.toString()) {
                await saveUserProgress(userAddress, questId, points.toString());
                onCompletion(points.toString());
            }
        });

        // Check past events
        const startBlock = await provider.getBlockNumber() - 1000; // Look back 1000 blocks
        const events = await contract.queryFilter(filter, startBlock);
        
        for (const event of events) {
            const [user, qId, points] = event.args;
            if (user.toLowerCase() === userAddress.toLowerCase() && qId.toString() === questId.toString()) {
                await saveUserProgress(userAddress, questId, points.toString());
                onCompletion(points.toString());
                break; // Stop after first match
            }
        }

        // Set up WebSocket connection for real-time updates
        const wsProvider = new ethers.providers.WebSocketProvider(
            `wss://monad-testnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
        );
        
        const wsContract = new ethers.Contract(contractAddress, contractABIs.questRegistry, wsProvider);
        wsContract.on(filter, async (user, qId, points) => {
            if (user.toLowerCase() === userAddress.toLowerCase() && qId.toString() === questId.toString()) {
                await saveUserProgress(userAddress, questId, points.toString());
                onCompletion(points.toString());
            }
        });

        return () => {
            contract.removeAllListeners(filter);
            wsContract.removeAllListeners(filter);
            wsProvider.destroy(); // Clean up WebSocket connection
        };
    } catch (error) {
        reportError(error);
        throw error;
    }
}

async function optInForQuest(contractAddress, questId) {
    try {
        if (!window.ethereum) throw new Error('MetaMask is required');

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABIs.questRegistry, signer);

        const tx = await contract.optInForQuest(questId);
        await tx.wait();
        
        // Sync progress after opting in
        await contract.syncProgress(await signer.getAddress(), questId);
        
        return true;
    } catch (error) {
        reportError(error);
        throw error;
    }
}

async function checkQuestOptIn(contractAddress, questId, userAddress) {
    try {
        const provider = await createAlchemyProvider();
        const contract = new ethers.Contract(contractAddress, contractABIs.questRegistry, provider);

        return await contract.isOptedIn(userAddress, questId);
    } catch (error) {
        reportError(error);
        throw error;
    }
}

async function getContractEvents(contractAddress, eventName, filter = {}, fromBlock = -1000) {
    try {
        const provider = await createAlchemyProvider();
        const contract = new ethers.Contract(contractAddress, contractABIs.questRegistry, provider);

        // Get current block and calculate start block
        const currentBlock = await provider.getBlockNumber();
        const startBlock = fromBlock < 0 ? currentBlock + fromBlock : fromBlock;

        // Query events
        const events = await contract.queryFilter(
            contract.filters[eventName](...Object.values(filter)),
            startBlock
        );

        return events.map(event => ({
            transactionHash: event.transactionHash,
            blockNumber: event.blockNumber,
            args: event.args,
            event: event.event,
            timestamp: null // Will be populated below
        }));
    } catch (error) {
        reportError(error);
        throw error;
    }
}

async function subscribeToContractEvents(contractAddress, eventName, callback, filter = {}) {
    try {
        const wsProvider = new ethers.providers.WebSocketProvider(
            `wss://monad-testnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
        );
        
        const contract = new ethers.Contract(contractAddress, contractABIs.questRegistry, wsProvider);
        const eventFilter = contract.filters[eventName](...Object.values(filter));

        contract.on(eventFilter, (...args) => {
            const event = args[args.length - 1];
            callback({
                transactionHash: event.transactionHash,
                blockNumber: event.blockNumber,
                args: args.slice(0, -1),
                event: eventName
            });
        });

        return () => {
            contract.removeAllListeners(eventFilter);
            wsProvider.destroy();
        };
    } catch (error) {
        reportError(error);
        throw error;
    }
}
