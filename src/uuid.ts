import {UUID as ModuleType} from './lib/_meta/module-types';

import {encodeToUuidV8} from './lib/uuid/uuidv8';
import {decodeFromUuidV8} from './lib/uuid/uuidv8';

const UUID:ModuleType = {
	encodeToUuidV8,
	decodeFromUuidV8
};

export {
	encodeToUuidV8,
	decodeFromUuidV8
};

export default UUID;
