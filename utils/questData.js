const QUESTS = [
    {
        id: 1,
        title: "Deploy Smart Contract",
        description: "Deploy your first smart contract on Monad testnet",
        reward: "100 Points",
        progress: 0,
        maxProgress: 1,
        status: "active",
        contractAddress: "0x1234...", // Organization's contract address
        organization: "MonadDev",
        eventName: "ContractDeployed"
    },
    {
        id: 2,
        title: "Interact with DEX",
        description: "Make a swap on MonadEx testnet",
        reward: "150 Points",
        progress: 0,
        maxProgress: 1,
        status: "active",
        contractAddress: "0x5678...", // DEX contract address
        organization: "MonadEx",
        eventName: "Swap"
    },
    {
        id: 3,
        title: "Bridge Assets",
        description: "Bridge tokens to Monad testnet using the official bridge",
        reward: "200 Points",
        progress: 0,
        maxProgress: 1,
        status: "active",
        contractAddress: "0x9abc...", // Bridge contract address
        organization: "MonadBridge",
        eventName: "BridgeCompleted"
    }
];

function getQuests() {
    try {
        return QUESTS;
    } catch (error) {
        reportError(error);
        return [];
    }
}

async function trackQuestProgress(questId, userAddress, onProgress) {
    try {
        const quest = QUESTS.find(q => q.id === questId);
        if (!quest) throw new Error('Quest not found');

        return await listenToQuestEvents(
            quest.contractAddress,
            questId,
            userAddress,
            (points) => {
                quest.progress = quest.maxProgress;
                quest.status = 'completed';
                onProgress(points);
            }
        );
    } catch (error) {
        reportError(error);
        throw error;
    }
}
