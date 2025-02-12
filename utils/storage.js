const ORG_STORAGE_KEY = 'monad-quest-organizations';
const QUEST_STORAGE_KEY = 'monad-quest-quests';

export const saveOrganization = async (orgData) => {
    const orgs = JSON.parse(localStorage.getItem(ORG_STORAGE_KEY) || '[]');
    const existing = orgs.find(o => o.address === orgData.address);
    if (!existing) {
        orgs.push(orgData);
        localStorage.setItem(ORG_STORAGE_KEY, JSON.stringify(orgs));
    }
    return orgData;
};

export const getOrganizations = async () => {
    return JSON.parse(localStorage.getItem(ORG_STORAGE_KEY) || '[]');
};

export const saveQuest = async (questData) => {
    const quests = JSON.parse(localStorage.getItem(QUEST_STORAGE_KEY) || '[]');
    const existing = quests.find(q => q.id === questData.id);
    if (!existing) {
        quests.push(questData);
        localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(quests));
    }
    return questData;
};

export const getQuests = async () => {
    return JSON.parse(localStorage.getItem(QUEST_STORAGE_KEY) || '[]');
};

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
