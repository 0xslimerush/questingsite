function Header({ address, onConnect }) {
    return (
        <header data-name="header" className="border-b border-purple-900/50 bg-purple-900/10 backdrop-blur-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div data-name="logo" className="flex items-center">
                    <h1 className="text-2xl font-bold gradient-text anime-glow">Monad Quests</h1>
                </div>
                <div data-name="nav-actions" className="flex items-center space-x-4">
                    {address ? (
                        <div data-name="wallet-info" className="flex items-center space-x-2 card-gradient px-4 py-2 rounded-lg">
                            <span className="text-sm text-purple-300">
                                {`${address.slice(0, 6)}...${address.slice(-4)}`}
                            </span>
                            <div className="h-2 w-2 rounded-full bg-purple-500 anime-glow"></div>
                        </div>
                    ) : (
                        <button
                            data-name="connect-button"
                            onClick={onConnect}
                            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium anime-glow"
                        >
                            Connect Wallet
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
