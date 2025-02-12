function OrganizationDashboard({ address, quests, onCreateQuest }) {
    try {
        const orgQuests = quests.filter(quest => quest.organization === address);

        return (
            <div data-name="org-dashboard" className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold gradient-text">Organization Dashboard</h2>
                    <button
                        onClick={() => onCreateQuest()}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium anime-glow"
                    >
                        <i className="fas fa-plus mr-2"></i>
                        Create New Quest
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orgQuests.map(quest => (
                        <div key={quest.id} className="card-gradient rounded-xl p-6 cyber-border">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-white">{quest.title}</h3>
                                <span className="quest-reward-badge px-3 py-1 rounded-full text-purple-300 text-sm">
                                    {quest.reward}
                                </span>
                            </div>
                            <p className="text-purple-300 mb-4">{quest.description}</p>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-purple-400">Participants</span>
                                    <span className="text-purple-300">0</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-purple-400">Completions</span>
                                    <span className="text-purple-300">0</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    } catch (error) {
        reportError(error);
        return null;
    }
}
