export interface FileSelectorModule {
  id: string;
  version: string;
  name: string;
  description: string;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  uiSchema: Record<string, unknown>;
  run: () => Promise<string[]>;
}

const module: FileSelectorModule = {
  id: 'file-selector',
  version: '1.0.0',
  name: 'File Selector',
  description: 'Prompts the user to select files',
  inputs: {},
  outputs: {},
  uiSchema: {},
  async run() {
    return new Promise<string[]>((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.onchange = () => {
        const files = Array.from(input.files ?? []).map(
          (f) => (f as any).path ?? f.name
        );
        resolve(files);
      };
      input.click();
    });
  },
};

export default module;
