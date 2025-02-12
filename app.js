function App() {
    const [address, setAddress] = React.useState(null);
    const [role, setRole] = React.useState(null);
    const [quests, setQuests] = React.useState([]);
    const [stats, setStats] = React.useState({
        completed: 0,
        points: 0,
        rank: 'Novice'
    });
    const [showOrgForm, setShowOrgForm] = React.useState(false);

    // Check if wallet is already connected
    React.useEffect(() => {
        try {
            const checkWallet = async () => {
                if (window.ethereum) {
                    const accounts = await window.ethereum.request({
                        method: 'eth_accounts'
                    });
                    if (accounts && accounts.length > 0) {
                        handleConnect(accounts[0]);
                    }
                }
            };
            checkWallet();

            // Listen for account changes
            if (window.ethereum) {
                window.ethereum.on('accountsChanged', (accounts) => {
                    if (accounts.length > 0) {
                        handleConnect(accounts[0]);
                    } else {
                        setAddress(null);
                        setRole(null);
                    }
                });
            }
        } catch (error) {
            reportError(error);
        }
    }, []);

    React.useEffect(() => {
        try {
            const loadQuests = async () => {
                const organizations = await getOrganizations();
                const questData = organizations.map((org, index) => ({
                    id: index + 1,
                    title: `${org.name} Quest`,
                    description: org.description,
                    reward: "100 Points",
                    progress: 0,
                    maxProgress: 1,
                    status: "active",
                    contractAddress: org.contractAddress,
                    organization: org.name,
                    eventName: org.eventName
                }));
                setQuests(questData);
            };
            
            loadQuests();
        } catch (error) {
            reportError(error);
        }
    }, []);

    React.useEffect(() => {
        if (address) {
            try {
                const loadUserData = async () => {
                    const userRole = await getUserRole(address);
                    if (userRole) {
                        setRole(userRole);
                    }

                    if (userRole === 'user') {
                        const progress = await getUserProgress(address);
                        setQuests(prevQuests => 
                            prevQuests.map(quest => ({
                                ...quest,
                                progress: progress[quest.id] || 0,
                                status: progress[quest.id] ? 'completed' : 'active'
                            }))
                        );
                    }
                };
                
                loadUserData();
            } catch (error) {
                reportError(error);
            }
        }
    }, [address]);

    const handleConnect = async (walletAddress) => {
        try {
            setAddress(walletAddress);
            const userRole = await getUserRole(walletAddress);
            if (userRole) {
                setRole(userRole);
                if (userRole === 'user') {
                    const userProgress = await getUserProgress(walletAddress);
                    const totalPoints = Object.values(userProgress).reduce((sum, points) => sum + parseInt(points || 0), 0);
                    
                    setStats({
                        completed: Object.keys(userProgress).length,
                        points: totalPoints,
                        rank: calculateRank(totalPoints)
                    });
                }
            }
        } catch (error) {
            reportError(error);
        }
    };

    const handleRoleSelect = async (selectedRole) => {
        try {
            await saveUserRole(address, selectedRole);
            setRole(selectedRole);
        } catch (error) {
            reportError(error);
        }
    };

    const handleQuestComplete = async (questId, points) => {
        try {
            await saveUserProgress(address, questId, points);
            
            setQuests(prevQuests => 
                prevQuests.map(quest => 
                    quest.id === questId 
                        ? { ...quest, status: 'completed', progress: quest.maxProgress }
                        : quest
                )
            );
            
            setStats(prevStats => {
                const newPoints = prevStats.points + parseInt(points);
                return {
                    completed: prevStats.completed + 1,
                    points: newPoints,
                    rank: calculateRank(newPoints)
                };
            });
        } catch (error) {
            reportError(error);
        }
    };

    const handleOrgSubmit = async (orgData) => {
        try {
            await saveOrganization(orgData);
            setQuests(prevQuests => [...prevQuests, {
                id: prevQuests.length + 1,
                title: `${orgData.name} Quest`,
                description: orgData.description,
                reward: "100 Points",
                progress: 0,
                maxProgress: 1,
                status: "active",
                contractAddress: orgData.contractAddress,
                organization: orgData.name,
                eventName: orgData.eventName
            }]);
            setShowOrgForm(false);
        } catch (error) {
            reportError(error);
        }
    };

    const calculateRank = (points) => {
        if (points >= 1000) return 'Legend';
        if (points >= 500) return 'Master';
        if (points >= 200) return 'Expert';
        if (points >= 100) return 'Advanced';
        return 'Novice';
    };

    const renderContent = () => {
        if (!address) {
            return <ConnectWallet onConnect={handleConnect} />;
        }

        if (!role) {
            return <RoleSelection onSelectRole={handleRoleSelect} />;
        }

        if (role === 'organization') {
            return (
                <div>
                    {showOrgForm ? (
                        <OrganizationForm onSubmit={handleOrgSubmit} />
                    ) : (
                        <OrganizationDashboard
                            address={address}
                            quests={quests}
                            onCreateQuest={() => setShowOrgForm(true)}
                        />
                    )}
                </div>
            );
        }

        return (
            <div>
                <Profile address={address} stats={stats} />
                <QuestList 
                    quests={quests} 
                    userAddress={address}
                    onQuestComplete={handleQuestComplete}
                />
            </div>
        );
    };

    return (
        <div data-name="app" className="min-h-screen bg-gray-900">
            <Header 
                address={address} 
                onConnect={() => {
                    setAddress(null);
                    setRole(null);
                }}
                onAddOrg={() => role === 'organization' && setShowOrgForm(true)}
            />
            <div className="container mx-auto px-4">
                {renderContent()}
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
