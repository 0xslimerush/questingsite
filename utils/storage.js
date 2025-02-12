const ORG_STORAGE_KEY = 'monad-quest-organizations';
const QUEST_STORAGE_KEY = 'monad-quest-quests';
const USER_ROLE_KEY = 'monad-quest-user-roles';
const USER_PROGRESS_KEY = 'monad-quest-user-progress';

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

export async function saveUserRole(address, role) {
    const roles = JSON.parse(localStorage.getItem(USER_ROLE_KEY) || '{}');
    roles[address.toLowerCase()] = role;
    localStorage.setItem(USER_ROLE_KEY, JSON.stringify(roles));
}

export async function getUserRole(address) {
    const roles = JSON.parse(localStorage.getItem(USER_ROLE_KEY) || '{}');
    return roles[address.toLowerCase()] || null;
}

export async function saveUserProgress(userAddress, questId, progress) {
    const key = `${USER_PROGRESS_KEY}:${userAddress.toLowerCase()}`;
    const progressData = JSON.parse(localStorage.getItem(key) || '{}');
    progressData[questId] = progress;
    localStorage.setItem(key, JSON.stringify(progressData));
}

export async function getUserProgress(userAddress) {
    const key = `${USER_PROGRESS_KEY}:${userAddress.toLowerCase()}`;
    return JSON.parse(localStorage.getItem(key) || '{}');
}
