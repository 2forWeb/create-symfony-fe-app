import { BaseAsset } from '../../base-asset';

export default class HelloControllerAsset extends BaseAsset {
    name = 'hello_controller.ts';
    relativePath = 'client/controllers';

    getContents(): string {
        return `import { Controller } from '@hotwired/stimulus';

/*
 * Delete this file once you add controllers here!
 */
export default class extends Controller {
    connect() {
        this.element.textContent = 'Hello Stimulus! Edit me in client/controllers/hello_controller.ts';
    }
}
`;
    }
}
