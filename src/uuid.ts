import {UUID as ModuleType} from './lib/_meta/module-types';

import {encodeIdToUuidV8} from './lib/uuid/uuidv8';
import {decodeUuidV8ToId} from './lib/uuid/uuidv8';
import {parseDecimalId} from './lib/uuid/uuidv8';

const UUID:ModuleType = {
	encodeIdToUuidV8,
	decodeUuidV8ToId,
	parseDecimalId
};

export {
	encodeIdToUuidV8,
	decodeUuidV8ToId,
	parseDecimalId
};

export default UUID;
