function QuestList({ quests, userAddress, onQuestComplete }) {
    try {
        return (
            <div data-name="quest-list" className="container mx-auto px-4 py-8">
                <div data-name="quest-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quests.map((quest) => (
                        <QuestCard 
                            key={quest.id} 
                            quest={quest} 
                            userAddress={userAddress}
                            onQuestComplete={onQuestComplete}
                        />
                    ))}
                </div>
            </div>
        );
    } catch (error) {
        reportError(error);
        return null;
    }
}
