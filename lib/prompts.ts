export interface PromptInput {
  id: string;
  label: string;
  type: 'text' | 'select' | 'number';
  options?: string[];
  placeholder?: string;
}

export interface PromptConfig {
  id: string;
  name: string;
  description: string;
  inputs: PromptInput[];
  template: string;
}

export const prompts: Record<string, PromptConfig> = {
  bio: {
    id: 'bio',
    name: 'Bio',
    description: 'Get a clear Instagram bio with a value statement and call-to-action',
    inputs: [
      { id: 'niche', label: 'Niche/Topic', type: 'text', placeholder: 'e.g., fitness coaching' },
      { id: 'audience', label: 'Audience', type: 'text', placeholder: 'e.g., busy professionals' },
      { id: 'goal', label: 'Main Instagram goal', type: 'text', placeholder: 'e.g., get more clients' },
    ],
    template: 'Write a simple Instagram bio with a clear one-line value statement and one call-to-action.',
  },
  reels: {
    id: 'reels',
    name: 'Reels',
    description: '10 beginner-friendly Reel ideas that don\'t need fancy editing',
    inputs: [
      { id: 'niche', label: 'Niche/Topic', type: 'text', placeholder: 'e.g., personal finance' },
      { id: 'audience', label: 'Audience', type: 'text', placeholder: 'e.g., college students' },
      { id: 'goal', label: 'Goal', type: 'select', options: ['followers', 'clients', 'sales', 'community'] },
    ],
    template: 'Give me 10 Reel ideas that are beginner-friendly and do not require fancy editing.',
  },
  hooks: {
    id: 'hooks',
    name: 'Hooks',
    description: '10 scroll-stopping hooks for your Reels',
    inputs: [
      { id: 'niche', label: 'Niche/Topic', type: 'text', placeholder: 'e.g., skincare' },
      { id: 'audience', label: 'Audience', type: 'text', placeholder: 'e.g., women 25-40' },
      { id: 'problem', label: 'One problem your audience struggles with', type: 'text', placeholder: 'e.g., acne breakouts' },
    ],
    template: 'Write 10 simple Instagram Reel hooks that would stop my audience from scrolling.',
  },
  captions: {
    id: 'captions',
    name: 'Captions',
    description: '5 different caption styles teaching the same lesson',
    inputs: [
      { id: 'niche', label: 'Niche/Topic', type: 'text', placeholder: 'e.g., productivity' },
      { id: 'audience', label: 'Audience', type: 'text', placeholder: 'e.g., entrepreneurs' },
      { id: 'lesson', label: 'One lesson from the post', type: 'text', placeholder: 'e.g., time blocking works' },
    ],
    template: 'Write 5 caption options that teach the same lesson in different ways.',
  },
  carousels: {
    id: 'carousels',
    name: 'Carousels',
    description: 'A complete carousel outline with slide-by-slide text',
    inputs: [
      { id: 'niche', label: 'Niche/Topic', type: 'text', placeholder: 'e.g., marketing tips' },
      { id: 'audience', label: 'Audience', type: 'text', placeholder: 'e.g., small business owners' },
      { id: 'lesson', label: 'One big lesson for this carousel', type: 'text', placeholder: 'e.g., how to write better hooks' },
      { id: 'slides', label: 'Number of slides', type: 'number', placeholder: '7' },
    ],
    template: 'Create a carousel outline with short slide text and one clear takeaway.',
  },
  outreach: {
    id: 'outreach',
    name: 'Outreach',
    description: 'A short, respectful DM template for collaborations',
    inputs: [
      { id: 'niche', label: 'Niche/Topic', type: 'text', placeholder: 'e.g., travel photography' },
      { id: 'audience', label: 'Audience', type: 'text', placeholder: 'e.g., adventure seekers' },
      { id: 'collaboration', label: 'Collaboration type you want', type: 'text', placeholder: 'e.g., brand partnership' },
    ],
    template: 'Write a DM outreach message to collaborate that is short, clear, and respectful.',
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    description: '10 post ideas optimized for your target metric',
    inputs: [
      { id: 'niche', label: 'Niche/Topic', type: 'text', placeholder: 'e.g., cooking' },
      { id: 'audience', label: 'Audience', type: 'text', placeholder: 'e.g., home cooks' },
      { id: 'metric', label: 'Target metric', type: 'select', options: ['saves', 'shares', 'follows'] },
    ],
    template: 'Suggest 10 post ideas engineered to increase this metric.',
  },
  monetization: {
    id: 'monetization',
    name: 'Monetization',
    description: 'A quick-start offer package and Instagram offer statement',
    inputs: [
      { id: 'niche', label: 'Niche/Topic', type: 'text', placeholder: 'e.g., graphic design' },
      { id: 'audience', label: 'Audience', type: 'text', placeholder: 'e.g., startups' },
      { id: 'sellType', label: 'What you\'re selling', type: 'select', options: ['service', 'product', 'course', 'newsletter'] },
    ],
    template: 'Package my service into a simple "quick start" offer and write a simple Instagram offer statement that a beginner can understand in 5 seconds.',
  },
  workflow: {
    id: 'workflow',
    name: 'Workflow',
    description: 'A simple weekly content creation workflow for your tools',
    inputs: [
      { id: 'niche', label: 'Niche/Topic', type: 'text', placeholder: 'e.g., lifestyle blogging' },
      { id: 'audience', label: 'Audience', type: 'text', placeholder: 'e.g., millennials' },
      { id: 'tools', label: 'Tools you have', type: 'select', options: ['phone only', 'phone + laptop'] },
    ],
    template: 'Build a simple content creation workflow I can repeat every week with my tools.',
  },
};

export const promptOrder = ['bio', 'reels', 'hooks', 'captions', 'carousels', 'outreach', 'growth', 'monetization', 'workflow'];

export const toneModifiers = {
  neutral: '',
  fun: 'Use a playful, energetic, and friendly tone with personality.',
  serious: 'Use a professional, authoritative, and direct tone.',
};

export type ToneType = 'neutral' | 'fun' | 'serious';
