function RoleSelection({ onSelectRole }) {
    try {
        return (
            <div data-name="role-selection" className="container mx-auto px-4 py-8">
                <div className="card-gradient rounded-xl p-8 max-w-2xl mx-auto cyber-border">
                    <h2 className="text-2xl font-bold gradient-text mb-6 text-center">Choose Your Role</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button
                            onClick={() => onSelectRole('user')}
                            className="p-6 card-gradient rounded-xl border border-purple-500/30 hover:border-purple-500/60 transition-all anime-glow"
                        >
                            <i className="fas fa-user text-4xl mb-4 gradient-text"></i>
                            <h3 className="text-xl font-bold mb-2 text-white">Quest Explorer</h3>
                            <p className="text-purple-300 text-sm">
                                Complete quests and earn rewards by participating in Monad ecosystem projects
                            </p>
                        </button>
                        <button
                            onClick={() => onSelectRole('organization')}
                            className="p-6 card-gradient rounded-xl border border-purple-500/30 hover:border-purple-500/60 transition-all anime-glow"
                        >
                            <i className="fas fa-building text-4xl mb-4 gradient-text"></i>
                            <h3 className="text-xl font-bold mb-2 text-white">Organization</h3>
                            <p className="text-purple-300 text-sm">
                                Create quests and engage users with your Monad project
                            </p>
                        </button>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        reportError(error);
        return null;
    }
}
