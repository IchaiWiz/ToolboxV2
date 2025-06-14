export interface LoggerOptions {
  prefix?: string;
}

export default {
  id: 'logger',
  name: 'logger',
  version: '1.0.0',
  description: 'Logs string input to console',
  inputs: ['text'],
  outputs: ['text'],
  uiSchema: {
    type: 'object',
    properties: {
      prefix: { type: 'string', title: 'Prefix' }
    },
    required: []
  },
  async run(input: string, options: LoggerOptions = {}): Promise<string> {
    const prefix = options.prefix ?? '';
    // eslint-disable-next-line no-console
    console.log(prefix + input);
    return input;
  }
};
