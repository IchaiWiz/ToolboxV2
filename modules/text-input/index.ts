export default {
  id: 'text-input',
  name: 'text-input',
  version: '1.0.0',
  description: 'Free text entry module',
  inputs: [],
  outputs: ['text'],
  uiSchema: {
    type: 'object',
    properties: {
      text: { type: 'string', title: 'Text' }
    },
    required: ['text']
  },
  async run(input: { text: string }): Promise<string> {
    return input.text;
  }
};
