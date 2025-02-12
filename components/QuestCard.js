function QuestCard({ quest, userAddress, onQuestComplete }) {
    try {
        const [isOptedIn, setIsOptedIn] = React.useState(false);
        const [isOptingIn, setIsOptingIn] = React.useState(false);
        const { id, title, description, reward, progress, maxProgress, status, contractAddress, organization } = quest;

        React.useEffect(() => {
            if (userAddress && contractAddress) {
                checkQuestOptIn(contractAddress, id, userAddress)
                    .then(setIsOptedIn)
                    .catch(error => reportError(error));
            }
        }, [userAddress, contractAddress, id]);

        React.useEffect(() => {
            if (isOptedIn && userAddress) {
                const cleanup = trackQuestProgress(id, userAddress, (points) => {
                    onQuestComplete(id, points);
                });
                return () => cleanup();
            }
        }, [isOptedIn, userAddress, id]);

        const handleOptIn = async () => {
            try {
                setIsOptingIn(true);
                await optInForQuest(contractAddress, id);
                setIsOptedIn(true);
            } catch (error) {
                reportError(error);
                alert('Failed to opt in: ' + error.message);
            } finally {
                setIsOptingIn(false);
            }
        };

        const cardClassName = `quest-card p-6 rounded-xl card-gradient cyber-border ${
            status === 'completed' ? 'quest-complete' : ''
        }`;

        return (
            <div data-name="quest-card" className={cardClassName}>
                <div data-name="quest-header" className="flex justify-between items-start mb-4">
                    <div>
                        <h3 data-name="quest-title" className="text-xl font-bold gradient-text">{title}</h3>
                        <p data-name="quest-org" className="text-sm text-purple-300">by {organization}</p>
                    </div>
                    <span data-name="quest-reward" className="quest-reward-badge px-3 py-1 rounded-full text-purple-300 text-sm">
                        {reward}
                    </span>
                </div>
                <p data-name="quest-description" className="text-purple-100 mb-4">{description}</p>
                <div data-name="quest-progress" className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-purple-300">Progress</span>
                        <span className="text-purple-200">{progress}/{maxProgress}</span>
                    </div>
                    <div className="progress-bar">
                        <div 
                            className="progress-fill" 
                            style={{ width: `${(progress / maxProgress) * 100}%` }}
                        ></div>
                    </div>
                </div>
                <button
                    data-name="quest-action"
                    onClick={handleOptIn}
                    className={`mt-4 w-full py-2 px-4 rounded-lg font-medium quest-opt-in-btn btn-hover-effect ${
                        status === 'completed' 
                            ? 'bg-green-600 text-white cursor-not-allowed'
                            : isOptedIn
                            ? 'bg-purple-700 text-white cursor-not-allowed'
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                    disabled={status === 'completed' || isOptedIn || isOptingIn}
                >
                    {status === 'completed' 
                        ? 'Completed' 
                        : isOptedIn
                        ? 'Tracking Progress'
                        : isOptingIn
                        ? 'Opting In...'
                        : 'Opt In to Quest'}
                </button>
            </div>
        );
    } catch (error) {
        reportError(error);
        return null;
    }
}
