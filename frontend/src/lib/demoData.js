const KEYS = {
  accounts: "charityChainAccounts",
  session: "charityChainSession",
  organizations: "charityChainOrganizations",
  campaigns: "charityChainCampaigns",
  donations: "charityChainDonations",
};

const read = (key, fallback = []) => JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("charityChainDataChanged"));
};

export const subscribeToDemoData = (callback) => {
  const sync = (event) => {
    if (event.type === "charityChainDataChanged" || event.key?.startsWith("charityChain")) callback();
  };
  window.addEventListener("charityChainDataChanged", sync);
  window.addEventListener("storage", sync);
  return () => { window.removeEventListener("charityChainDataChanged", sync); window.removeEventListener("storage", sync); };
};

export const getAccounts = () => read(KEYS.accounts);
export const saveAccounts = (items) => write(KEYS.accounts, items);
export const getOrganizations = () => read(KEYS.organizations);
export const saveOrganizations = (items) => write(KEYS.organizations, items);
export const getCampaigns = () => read(KEYS.campaigns);
export const saveCampaigns = (items) => write(KEYS.campaigns, items);
export const getDonations = () => read(KEYS.donations);
export const saveDonations = (items) => write(KEYS.donations, items);
export const getSession = () => JSON.parse(localStorage.getItem(KEYS.session) || "null");
export const saveSession = (item) => write(KEYS.session, item);
export const signOut = () => localStorage.removeItem(KEYS.session);
export const id = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function seedDemoData() {
  // Remove the previous built-in sample records so no invented ETH totals
  // survive in an existing browser profile.
  const campaigns = getCampaigns();
  if (campaigns.some((item) => item.id === "campaign-seed")) {
    saveCampaigns(campaigns.filter((item) => item.id !== "campaign-seed"));
    saveDonations(getDonations().filter((item) => item.campaignId !== "campaign-seed"));
  }
  const organizations = getOrganizations();
  if (organizations.some((item) => item.id === "org-seed")) saveOrganizations(organizations.filter((item) => item.id !== "org-seed"));
}
