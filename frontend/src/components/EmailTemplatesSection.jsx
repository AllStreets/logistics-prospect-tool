import { useState } from 'react';
import './EmailTemplatesSection.css';

export default function EmailTemplatesSection({ companyName, painPoints }) {
  const [copiedTemplate, setCopiedTemplate] = useState(null);

  const templates = [
    {
      id: 'generic',
      name: 'Generic Cold Outreach',
      body: `Hi [Name],

I've been following ${companyName}'s growth in the logistics space, and I noticed operational efficiency is a key priority for teams like yours.

Our clients in similar positions reported a 40% reduction in driver coordination time and significant compliance improvements using AI-powered call automation.

I'd love to show you a quick 15-minute demo of how this works.

Best,
[Your Name]`
    },
    {
      id: 'painpoint',
      name: 'Pain Point-Specific',
      body: `Hi [Name],

I've been following ${companyName}, and I see you're managing some of the toughest challenges in trucking: ${painPoints?.[0] || 'operational efficiency'} and ${painPoints?.[1] || 'driver retention'}.

We help carriers like you reduce coordination friction and improve operational efficiency through automated call handling, which directly impacts your bottom line.

Could we chat about whether this is relevant for your operations?

Best,
[Your Name]`
    },
    {
      id: 'executive',
      name: 'Executive/Decision Maker',
      body: `Hi [Name],

Quick question: What's your biggest operational cost driver at ${companyName}?

Most fleet leaders point to driver coordination complexity and compliance overhead. We typically help teams recoup implementation costs in 6-8 months through efficiency gains alone.

Happy to share specifics if relevant.

Best,
[Your Name]`
    }
  ];

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate(id);
    setTimeout(() => setCopiedTemplate(null), 2000);
  };

  return (
    <div className="email-templates-section">
      <div className="section-header templates-header">
        <h3>Email Templates</h3>
      </div>
      <div className="section-content">
        <p className="templates-intro">Ready-to-use email templates tailored to different decision makers:</p>
        {templates.map(template => (
          <div key={template.id} className="template-card">
            <div className="template-header">
              <h4>{template.name}</h4>
              <button
                className={`copy-btn ${copiedTemplate === template.id ? 'copied' : ''}`}
                onClick={() => copyToClipboard(template.body, template.id)}
              >
                {copiedTemplate === template.id ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
            <pre className="template-body">{template.body}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
