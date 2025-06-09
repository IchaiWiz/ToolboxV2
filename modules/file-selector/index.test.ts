import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fileSelector from './index';

describe('file-selector run', () => {
  let originalDocument: any;

  beforeEach(() => {
    originalDocument = global.document;
  });

  afterEach(() => {
    global.document = originalDocument;
    vi.restoreAllMocks();
  });

  it('returns selected file paths', async () => {
    const fakeInput: any = {
      type: '',
      multiple: false,
      files: [{ path: '/tmp/test.txt', name: 'test.txt' }],
      onchange: undefined as ((e: any) => void) | undefined,
      click() {
        if (this.onchange) this.onchange({ target: this });
      },
    };

    const createElement = vi.fn(() => fakeInput);
    global.document = { createElement } as any;

    const paths = await fileSelector.run();
    expect(createElement).toHaveBeenCalledWith('input');
    expect(paths).toEqual(['/tmp/test.txt']);
  });
});
