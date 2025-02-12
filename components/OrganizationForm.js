function OrganizationForm({ onSubmit }) {
    try {
        const [formData, setFormData] = React.useState({
            name: '',
            contractAddress: '',
            eventName: '',
            description: ''
        });

        const handleSubmit = async (e) => {
            try {
                e.preventDefault();
                await saveOrganization(formData);
                onSubmit(formData);
                setFormData({
                    name: '',
                    contractAddress: '',
                    eventName: '',
                    description: ''
                });
            } catch (error) {
                reportError(error);
                alert('Failed to register organization: ' + error.message);
            }
        };

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        };

        return (
            <div data-name="org-form" className="container mx-auto px-4 py-8">
                <form onSubmit={handleSubmit} className="card-gradient rounded-xl p-6 cyber-border max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold gradient-text mb-6">Register Organization</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-purple-300 mb-2">Organization Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-purple-900/20 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-purple-300 mb-2">Contract Address</label>
                            <input
                                type="text"
                                name="contractAddress"
                                value={formData.contractAddress}
                                onChange={handleChange}
                                className="w-full bg-purple-900/20 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-purple-300 mb-2">Event Name</label>
                            <input
                                type="text"
                                name="eventName"
                                value={formData.eventName}
                                onChange={handleChange}
                                className="w-full bg-purple-900/20 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-purple-300 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full bg-purple-900/20 border border-purple-500/30 rounded-lg px-4 py-2 text-white h-24"
                                required
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-white anime-glow"
                        >
                            Register Organization
                        </button>
                    </div>
                </form>
            </div>
        );
    } catch (error) {
        reportError(error);
        return null;
    }
}
