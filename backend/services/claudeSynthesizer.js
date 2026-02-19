const axios = require('axios');

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

async function synthesizeIntelligence(aggregatedData) {
  const { companyName, news, searchResults } = aggregatedData;

  const systemPrompt = `You are an expert SDR intelligence analyst specializing in the logistics and trucking industry.
You analyze companies through the lens of AI-powered call automation solutions like HappyRobot.
Your goal is to surface operational pain points and craft compelling outreach angles.

Focus on:
- Driver communication challenges (coordination, compliance, safety)
- Dispatch and routing inefficiencies
- Customer communication friction
- Compliance and safety tracking burdens
- Lack of automation in operations`;

  const userPrompt = `Analyze this trucking/logistics company and provide intelligence for an SDR pitching AI-powered call automation:

Company: ${companyName}

Recent News:
${news.map(n => `- ${n.title}`).join('\n') || 'No recent news available'}

Search Results:
${searchResults.map(r => `- ${r.title}: ${r.snippet}`).join('\n') || 'Limited search data'}

Provide a JSON response with exactly these fields:
{
  "profile": "2-3 sentence company overview including size, location, specialty, and business model",
  "painPoints": ["Pain point 1", "Pain point 2", "Pain point 3"],
  "techStack": "1-2 sentence assessment of visible technology/infrastructure. If unknown, say 'Limited public tech visibility'",
  "outreachAngle": "Specific 1-2 sentence cold call pitch for HappyRobot that addresses their pain points",
  "decisionMakers": [
    {
      "title": "Decision maker title/role (e.g., Fleet Manager, Operations Director, VP Logistics)",
      "concerns": ["Their specific concern 1", "Their specific concern 2"]
    },
    {
      "title": "Another decision maker title",
      "concerns": ["Their specific concern 1", "Their specific concern 2"]
    }
  ]
}

For decisionMakers, tailor titles based on company type:
- Large carriers (100+ trucks): Include Fleet Manager, Operations Director, VP of Logistics
- Owner-operator networks: Include Network Coordinator, Owner-Operators Representative
- Specialty carriers: Include Compliance Officer, Safety Manager, Operations Manager

Keep response concise but complete.`;

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4-turbo',
        max_tokens: 500,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);

      // Add fallback for decisionMakers if not present
      if (!parsed.decisionMakers || !Array.isArray(parsed.decisionMakers)) {
        parsed.decisionMakers = [
          { title: 'Operations Manager', concerns: ['Driver coordination', 'Compliance efficiency'] },
          { title: 'Fleet Manager', concerns: ['Cost optimization', 'Routing efficiency'] }
        ];
      }

      // Ensure all decisionMakers have concerns as arrays
      if (parsed.decisionMakers && Array.isArray(parsed.decisionMakers)) {
        parsed.decisionMakers = parsed.decisionMakers.map(maker => ({
          ...maker,
          concerns: Array.isArray(maker.concerns) ? maker.concerns : [maker.concerns]
        }));
      }

      return parsed;
    }
    throw new Error('Could not parse JSON from OpenAI response');
  } catch (error) {
    console.error('OpenAI API error:', error.message);
    return {
      profile: 'Unable to generate profile at this time.',
      painPoints: ['Unable to analyze at this time'],
      techStack: 'Data unavailable',
      outreachAngle: 'Please try again shortly.'
    };
  }
}

module.exports = { synthesizeIntelligence };
