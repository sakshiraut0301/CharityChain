export const campaignCurrency = () => "ETH";
export const amount = (_campaign, value) => `${Number(value || 0).toFixed(4)} ETH`;
export const remaining = (campaign) => Math.max(Number(campaign.goal || 0) - Number(campaign.raised || 0), 0);
export const progress = (campaign) => campaign.goal ? Math.min(100, (campaign.raised / campaign.goal) * 100) : 0;
export const totalLabel = (campaigns, field = "raised") => `${campaigns.reduce((total, campaign) => total + Number(campaign[field] || 0), 0).toFixed(4)} ETH`;
