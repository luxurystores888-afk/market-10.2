// 📧 EMAIL MARKETING & NEWSLETTER AUTOMATION - ZERO COST SOLUTION
import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  Users, 
  TrendingUp, 
  Calendar, 
  Target, 
  BarChart3, 
  Plus,
  Edit3,
  Trash2,
  Eye,
  Copy,
  Download,
  Filter,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'newsletter' | 'promotional' | 'welcome' | 'abandoned-cart' | 'follow-up';
  status: 'draft' | 'scheduled' | 'sent' | 'paused';
  scheduledAt?: Date;
  sentAt?: Date;
  recipients: number;
  opened: number;
  clicked: number;
  revenue: number;
  createdAt: Date;
  template: string;
}

interface EmailSubscriber {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  source: string;
  subscribedAt: Date;
  tags: string[];
  totalSpent: number;
  lastActive: Date;
}

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  content: string;
  thumbnail: string;
}

export function EmailMarketing() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [activeTab, setActiveTab] = useState<'campaigns' | 'subscribers' | 'templates' | 'analytics'>('campaigns');
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [newCampaign, setNewCampaign] = useState<Partial<EmailCampaign>>({
    name: '',
    subject: '',
    content: '',
    type: 'newsletter',
    status: 'draft'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  useEffect(() => {
    loadEmailData();
  }, []);

  const loadEmailData = async () => {
    // Mock data - in production, integrate with email service API
    const mockCampaigns: EmailCampaign[] = [
      {
        id: '1',
        name: 'Welcome Series - New Customers',
        subject: '🎉 Welcome to Cyber Mart 2077! Your AI Shopping Journey Begins',
        content: 'Welcome to the future of shopping! Discover AI-powered features...',
        type: 'welcome',
        status: 'sent',
        sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        recipients: 1247,
        opened: 623,
        clicked: 187,
        revenue: 15420,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        template: 'welcome'
      },
      {
        id: '2',
        name: 'Black Friday Mega Sale',
        subject: '🔥 500% OFF Everything! AI-Generated Products Only Today',
        content: 'Massive discounts on all AI-generated products...',
        type: 'promotional',
        status: 'scheduled',
        scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        recipients: 5432,
        opened: 0,
        clicked: 0,
        revenue: 0,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        template: 'promotional'
      },
      {
        id: '3',
        name: 'Abandoned Cart Recovery',
        subject: 'You left something amazing behind... 💔',
        content: 'Complete your purchase and save 20%...',
        type: 'abandoned-cart',
        status: 'sent',
        sentAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        recipients: 89,
        opened: 34,
        clicked: 12,
        revenue: 2180,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        template: 'cart-recovery'
      }
    ];

    const mockSubscribers: EmailSubscriber[] = [
      {
        id: '1',
        email: 'cyber.gamer99@email.com',
        firstName: 'Alex',
        lastName: 'Chen',
        status: 'active',
        source: 'website-signup',
        subscribedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        tags: ['vip', 'tech-enthusiast'],
        totalSpent: 2450,
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: '2',
        email: 'nft.collector@email.com',
        firstName: 'Jordan',
        lastName: 'Smith',
        status: 'active',
        source: 'nft-marketplace',
        subscribedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        tags: ['nft', 'crypto'],
        totalSpent: 890,
        lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    ];

    const mockTemplates: EmailTemplate[] = [
      {
        id: 'welcome',
        name: 'Welcome Series',
        description: 'Perfect for new subscriber onboarding',
        type: 'welcome',
        content: `<h1>Welcome to Cyber Mart 2077!</h1><p>Your AI-powered shopping journey begins now...</p>`,
        thumbnail: 'https://picsum.photos/300/200?random=1'
      },
      {
        id: 'promotional',
        name: 'Promotional Campaign',
        description: 'Eye-catching design for sales and offers',
        type: 'promotional',
        content: `<h1>🔥 MEGA SALE ALERT! 🔥</h1><p>Don't miss out on incredible savings...</p>`,
        thumbnail: 'https://picsum.photos/300/200?random=2'
      },
      {
        id: 'newsletter',
        name: 'Monthly Newsletter',
        description: 'Clean design for regular updates',
        type: 'newsletter',
        content: `<h1>This Month in AI & E-commerce</h1><p>Latest trends and insights...</p>`,
        thumbnail: 'https://picsum.photos/300/200?random=3'
      }
    ];

    setCampaigns(mockCampaigns);
    setSubscribers(mockSubscribers);
    setTemplates(mockTemplates);
  };

  const createCampaign = async () => {
    if (!newCampaign.name || !newCampaign.subject || !newCampaign.content) return;

    const campaign: EmailCampaign = {
      id: Date.now().toString(),
      name: newCampaign.name!,
      subject: newCampaign.subject!,
      content: newCampaign.content!,
      type: newCampaign.type as any || 'newsletter',
      status: 'draft',
      recipients: subscribers.filter(s => s.status === 'active').length,
      opened: 0,
      clicked: 0,
      revenue: 0,
      createdAt: new Date(),
      template: selectedTemplate || 'default'
    };

    setCampaigns(prev => [campaign, ...prev]);
    setNewCampaign({ name: '', subject: '', content: '', type: 'newsletter', status: 'draft' });
    setIsCreatingCampaign(false);
  };

  const sendCampaign = async (campaignId: string) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, status: 'sent' as any, sentAt: new Date() }
        : campaign
    ));
  };

  const getStats = () => {
    const totalSent = campaigns.filter(c => c.status === 'sent').reduce((sum, c) => sum + c.recipients, 0);
    const totalOpened = campaigns.reduce((sum, c) => sum + c.opened, 0);
    const totalClicked = campaigns.reduce((sum, c) => sum + c.clicked, 0);
    const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
    const activeSubscribers = subscribers.filter(s => s.status === 'active').length;

    return {
      totalSent,
      openRate: totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0,
      clickRate: totalSent > 0 ? Math.round((totalClicked / totalSent) * 100) : 0,
      totalRevenue,
      activeSubscribers,
      growth: '+23%' // Mock growth
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            📧 Email Marketing Hub
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Free email marketing automation that drives sales and engagement
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <div className="bg-green-500/20 border border-green-400 px-4 py-2 rounded-full flex items-center">
              <Users className="h-4 w-4 mr-2" />
              {stats.activeSubscribers} Active Subscribers
            </div>
            <div className="bg-blue-500/20 border border-blue-400 px-4 py-2 rounded-full flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              {stats.openRate}% Open Rate
            </div>
            <div className="bg-purple-500/20 border border-purple-400 px-4 py-2 rounded-full flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              ${stats.totalRevenue.toLocaleString()} Revenue
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400 mb-1">{stats.activeSubscribers}</div>
            <div className="text-sm text-gray-400">Subscribers</div>
            <div className="text-xs text-green-400">{stats.growth}</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">{stats.totalSent}</div>
            <div className="text-sm text-gray-400">Emails Sent</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">{stats.openRate}%</div>
            <div className="text-sm text-gray-400">Open Rate</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">{stats.clickRate}%</div>
            <div className="text-sm text-gray-400">Click Rate</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-400 mb-1">${stats.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Revenue</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          {['campaigns', 'subscribers', 'templates', 'analytics'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 rounded-lg font-medium transition-all capitalize ${
                activeTab === tab 
                  ? 'bg-cyan-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Email Campaigns</h2>
              <button
                onClick={() => setIsCreatingCampaign(true)}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-all flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </button>
            </div>

            {/* Create Campaign Modal */}
            {isCreatingCampaign && (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold mb-4 text-cyan-400">Create New Campaign</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Campaign name..."
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Email subject line..."
                    value={newCampaign.subject}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                      value={newCampaign.type}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, type: e.target.value as any }))}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="newsletter">Newsletter</option>
                      <option value="promotional">Promotional</option>
                      <option value="welcome">Welcome Series</option>
                      <option value="abandoned-cart">Abandoned Cart</option>
                      <option value="follow-up">Follow-up</option>
                    </select>
                    <select
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="">Choose template...</option>
                      {templates.map(template => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    placeholder="Email content..."
                    value={newCampaign.content}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, content: e.target.value }))}
                    rows={6}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={createCampaign}
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
                    >
                      Create Campaign
                    </button>
                    <button
                      onClick={() => setIsCreatingCampaign(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Campaigns List */}
            <div className="space-y-4">
              {campaigns.map(campaign => (
                <div
                  key={campaign.id}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-cyan-400/50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{campaign.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          campaign.status === 'sent' ? 'bg-green-500/20 text-green-400 border border-green-400' :
                          campaign.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400 border border-blue-400' :
                          campaign.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400' :
                          'bg-gray-500/20 text-gray-400 border border-gray-400'
                        }`}>
                          {campaign.status === 'sent' && <CheckCircle className="inline h-3 w-3 mr-1" />}
                          {campaign.status === 'scheduled' && <Clock className="inline h-3 w-3 mr-1" />}
                          {campaign.status === 'draft' && <Edit3 className="inline h-3 w-3 mr-1" />}
                          {campaign.status}
                        </span>
                        <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs border border-purple-400">
                          {campaign.type}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-3">{campaign.subject}</p>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-lg font-bold text-cyan-400">{campaign.recipients}</div>
                          <div className="text-gray-400">Recipients</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-400">
                            {campaign.recipients > 0 ? Math.round((campaign.opened / campaign.recipients) * 100) : 0}%
                          </div>
                          <div className="text-gray-400">Opened</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-yellow-400">
                            {campaign.recipients > 0 ? Math.round((campaign.clicked / campaign.recipients) * 100) : 0}%
                          </div>
                          <div className="text-gray-400">Clicked</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-400">${campaign.revenue}</div>
                          <div className="text-gray-400">Revenue</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button className="bg-cyan-500/20 border border-cyan-400 text-cyan-400 p-2 rounded hover:bg-cyan-500/30 transition-all">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="bg-blue-500/20 border border-blue-400 text-blue-400 p-2 rounded hover:bg-blue-500/30 transition-all">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button className="bg-gray-500/20 border border-gray-400 text-gray-400 p-2 rounded hover:bg-gray-500/30 transition-all">
                        <Copy className="h-4 w-4" />
                      </button>
                      {campaign.status === 'draft' && (
                        <button
                          onClick={() => sendCampaign(campaign.id)}
                          className="bg-green-500/20 border border-green-400 text-green-400 p-2 rounded hover:bg-green-500/30 transition-all"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      )}
                      <button className="bg-red-500/20 border border-red-400 text-red-400 p-2 rounded hover:bg-red-500/30 transition-all">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subscribers Tab */}
        {activeTab === 'subscribers' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Email Subscribers</h2>
              <div className="flex space-x-2">
                <button className="bg-green-500/20 border border-green-400 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-all flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
                <button className="bg-blue-500/20 border border-blue-400 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-all flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Import
                </button>
              </div>
            </div>

            {/* Subscribers List */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="text-left p-4 text-gray-300">Subscriber</th>
                    <th className="text-left p-4 text-gray-300">Status</th>
                    <th className="text-left p-4 text-gray-300">Source</th>
                    <th className="text-left p-4 text-gray-300">Total Spent</th>
                    <th className="text-left p-4 text-gray-300">Last Active</th>
                    <th className="text-left p-4 text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map(subscriber => (
                    <tr key={subscriber.id} className="border-t border-gray-700 hover:bg-gray-700/30">
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-white">
                            {subscriber.firstName} {subscriber.lastName}
                          </div>
                          <div className="text-sm text-gray-400">{subscriber.email}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          subscriber.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          subscriber.status === 'unsubscribed' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {subscriber.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300">{subscriber.source}</td>
                      <td className="p-4 text-green-400 font-medium">${subscriber.totalSpent}</td>
                      <td className="p-4 text-gray-400">
                        {subscriber.lastActive.toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button className="text-cyan-400 hover:text-cyan-300">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-blue-400 hover:text-blue-300">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button className="text-red-400 hover:text-red-300">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Email Templates</h2>
              <button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-all flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map(template => (
                <div
                  key={template.id}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:border-cyan-400/50 transition-all"
                >
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2">{template.name}</h3>
                    <p className="text-gray-300 text-sm mb-3">{template.description}</p>
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-cyan-500/20 border border-cyan-400 text-cyan-400 px-3 py-2 rounded text-sm hover:bg-cyan-500/30 transition-all">
                        Preview
                      </button>
                      <button className="flex-1 bg-blue-500/20 border border-blue-400 text-blue-400 px-3 py-2 rounded text-sm hover:bg-blue-500/30 transition-all">
                        Use Template
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Email Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Chart */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-cyan-400 mb-4">Campaign Performance</h3>
                <div className="space-y-4">
                  {campaigns.filter(c => c.status === 'sent').map(campaign => (
                    <div key={campaign.id} className="flex items-center justify-between">
                      <span className="text-gray-300">{campaign.name}</span>
                      <div className="flex space-x-4 text-sm">
                        <span className="text-green-400">
                          {Math.round((campaign.opened / campaign.recipients) * 100)}% open
                        </span>
                        <span className="text-yellow-400">
                          {Math.round((campaign.clicked / campaign.recipients) * 100)}% click
                        </span>
                        <span className="text-purple-400">
                          ${campaign.revenue}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue Chart */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-cyan-400 mb-4">Revenue Attribution</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">
                    ${stats.totalRevenue.toLocaleString()}
                  </div>
                  <div className="text-gray-400">Total Email Revenue</div>
                  <div className="text-sm text-green-400 mt-2">+45% vs last month</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
