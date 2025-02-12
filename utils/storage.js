async function saveUserRole(address, role) {
    try {
        const objectType = 'user-role';
        await trickleCreateObject(objectType, {
            address,
            role,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        reportError(error);
        throw error;
    }
}

async function getUserRole(address) {
    try {
        const objectType = 'user-role';
        const { items } = await trickleListObjects(objectType, 1, true);
        const userRole = items.find(item => item.objectData.address === address);
        return userRole ? userRole.objectData.role : null;
    } catch (error) {
        reportError(error);
        throw error;
    }
}

async function saveUserProgress(userAddress, questId, progress) {
    try {
        const objectType = `progress:${userAddress}`;
        const progressData = {
            questId,
            progress,
            timestamp: new Date().toISOString()
        };
        
        await trickleCreateObject(objectType, progressData);
    } catch (error) {
        reportError(error);
        throw error;
    }
}

async function getUserProgress(userAddress) {
    try {
        const objectType = `progress:${userAddress}`;
        const { items } = await trickleListObjects(objectType, 100, true);
        return items.reduce((acc, item) => {
            acc[item.objectData.questId] = item.objectData.progress;
            return acc;
        }, {});
    } catch (error) {
        reportError(error);
        throw error;
    }
}

async function saveOrganization(orgData) {
    try {
        const objectType = 'organization';
        await trickleCreateObject(objectType, orgData);
    } catch (error) {
        reportError(error);
        throw error;
    }
}

async function getOrganizations() {
    try {
        const objectType = 'organization';
        const { items } = await trickleListObjects(objectType, 100, true);
        return items.map(item => item.objectData);
    } catch (error) {
        reportError(error);
        throw error;
    }
}
