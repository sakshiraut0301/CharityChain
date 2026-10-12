// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CharityChain {
    address public immutable admin;
    uint256 public campaignCount;
    bool private locked;
    mapping(address => bool) public verifiedOrganizations;
    struct Campaign { address payable organization; uint256 targetAmount; uint256 raisedAmount; uint256 deadline; bool active; bool paused; string metadataURI; }
    mapping(uint256 => Campaign) public campaigns;
    event OrganizationVerified(address indexed organization, bool approved);
    event CampaignCreated(uint256 indexed campaignId, address indexed organization, uint256 targetAmount, uint256 deadline, string metadataURI);
    event DonationMade(uint256 indexed campaignId, address indexed donor, address indexed organization, uint256 amount, uint256 timestamp);
    event CampaignPaused(uint256 indexed campaignId, address indexed changedBy);
    event CampaignResumed(uint256 indexed campaignId, address indexed changedBy);
    event CampaignClosed(uint256 indexed campaignId, address indexed changedBy);
    modifier onlyAdmin() { require(msg.sender == admin, "Admin only"); _; }
    modifier nonReentrant() { require(!locked, "Reentrant call"); locked = true; _; locked = false; }
    constructor() { admin = msg.sender; }
    function verifyOrganization(address organization, bool approved) external onlyAdmin { verifiedOrganizations[organization] = approved; emit OrganizationVerified(organization, approved); }
    function createCampaign(uint256 targetAmount, uint256 deadline, string calldata metadataURI) external returns (uint256 campaignId) { require(verifiedOrganizations[msg.sender], "Organization not verified"); require(targetAmount > 0 && deadline > block.timestamp, "Invalid campaign"); campaignId = ++campaignCount; campaigns[campaignId] = Campaign(payable(msg.sender), targetAmount, 0, deadline, true, false, metadataURI); emit CampaignCreated(campaignId, msg.sender, targetAmount, deadline, metadataURI); }
    function donate(uint256 campaignId) external payable nonReentrant { Campaign storage campaign = campaigns[campaignId]; require(campaign.active && !campaign.paused && block.timestamp <= campaign.deadline, "Campaign unavailable"); require(msg.value > 0, "Donation must be positive"); campaign.raisedAmount += msg.value; (bool sent,) = campaign.organization.call{value: msg.value}(""); require(sent, "Fund transfer failed"); emit DonationMade(campaignId, msg.sender, campaign.organization, msg.value, block.timestamp); }
    function closeCampaign(uint256 campaignId) external { Campaign storage campaign = campaigns[campaignId]; require(msg.sender == campaign.organization || msg.sender == admin, "Unauthorized"); campaign.active = false; emit CampaignClosed(campaignId, msg.sender); }
    function pauseCampaign(uint256 campaignId) external { Campaign storage campaign = campaigns[campaignId]; require(msg.sender == campaign.organization || msg.sender == admin, "Unauthorized"); require(campaign.active, "Campaign closed"); campaign.paused = true; emit CampaignPaused(campaignId, msg.sender); }
    function resumeCampaign(uint256 campaignId) external { Campaign storage campaign = campaigns[campaignId]; require(msg.sender == campaign.organization || msg.sender == admin, "Unauthorized"); require(campaign.active, "Campaign closed"); campaign.paused = false; emit CampaignResumed(campaignId, msg.sender); }
}
