function Profile({ address, stats }) {
    try {
        return (
            <div data-name="profile" className="container mx-auto px-4 py-8">
                <div className="card-gradient rounded-xl p-6 cyber-border">
                    <div data-name="profile-header" className="flex items-center space-x-4 mb-6">
                        <div data-name="avatar" className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 anime-glow pulse">
                            <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-600/50 to-purple-800/50 backdrop-blur-sm"></div>
                        </div>
                        <div>
                            <h2 data-name="wallet-address" className="text-xl font-bold gradient-text">
                                {`${address.slice(0, 6)}...${address.slice(-4)}`}
                            </h2>
                            <p className="text-purple-300">Monad Quest Explorer</p>
                        </div>
                    </div>
                    <div data-name="stats" className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-purple-900/20 rounded-lg card-gradient floating">
                            <p className="text-2xl font-bold text-white">{stats.completed}</p>
                            <p className="text-sm text-purple-300">Quests Completed</p>
                        </div>
                        <div className="text-center p-4 bg-purple-900/20 rounded-lg card-gradient floating" style={{animationDelay: '0.1s'}}>
                            <p className="text-2xl font-bold gradient-text">{stats.points}</p>
                            <p className="text-sm text-purple-300">Points Earned</p>
                        </div>
                        <div className="text-center p-4 bg-purple-900/20 rounded-lg card-gradient floating" style={{animationDelay: '0.2s'}}>
                            <p className="text-2xl font-bold text-white">{stats.rank}</p>
                            <p className="text-sm text-purple-300">Global Rank</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        reportError(error);
        return null;
    }
}
