function ConnectWallet({ onConnect }) {
    try {
        const handleConnect = async () => {
            try {
                if (!window.ethereum) {
                    throw new Error('Please install MetaMask to connect');
                }
                
                // Request account access
                const accounts = await window.ethereum.request({ 
                    method: 'eth_requestAccounts' 
                });
                
                if (accounts && accounts.length > 0) {
                    onConnect(accounts[0]);
                } else {
                    throw new Error('No accounts found');
                }
            } catch (error) {
                reportError(error);
                alert('Failed to connect wallet: ' + error.message);
            }
        };

        return (
            <div data-name="connect-wallet" className="container mx-auto px-4 py-8">
                <div className="card-gradient rounded-xl p-8 max-w-md mx-auto cyber-border">
                    <h2 className="text-2xl font-bold gradient-text mb-4">Connect Wallet</h2>
                    <p className="text-purple-300 mb-6">
                        Connect your wallet to start completing quests and earning rewards on Monad
                    </p>
                    <button
                        onClick={handleConnect}
                        className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-white anime-glow"
                    >
                        <i className="fas fa-wallet mr-2"></i>
                        Connect MetaMask
                    </button>
                </div>
            </div>
        );
    } catch (error) {
        reportError(error);
        return null;
    }
}
