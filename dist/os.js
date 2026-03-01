"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appDataDirectory = appDataDirectory;
const path_1 = require("path");
function appDataDirectory(params) {
    if (!params.appName || !params.appAuthor) {
        throw new Error('appName and appAuthor are required');
    }
    switch (params.platform || process.platform) {
        case 'darwin':
            if (process.env.HOME) {
                return (0, path_1.join)(process.env.HOME, 'Library', 'Application Support', params.appName);
            }
            // No HOME env var
            return null;
        case 'win32':
            let appDataVar = params.useRoaming ? 'APPDATA' : 'LOCALAPPDATA';
            let basePath = process.env[appDataVar] || process.env.APPDATA;
            if (basePath) {
                return (0, path_1.join)(basePath, params.appAuthor, params.appName);
            }
            // No APPDATA or LOCALAPPDATA env var
            return null;
        default:
            if (process.env.XDG_DATA_HOME) {
                return (0, path_1.join)(process.env.XDG_DATA_HOME, params.appName);
            }
            else if (process.env.HOME) {
                return (0, path_1.join)(process.env.HOME, '.local', 'share', params.appName);
            }
            else {
                // No XDG_DATA_HOME or HOME env var
                return null;
            }
    }
}
const OS = {
    appDataDirectory
};
exports.default = OS;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvb3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUE4Q0MsNENBQWdCO0FBOUNqQiwrQkFBMEI7QUFLMUIsU0FBUyxnQkFBZ0IsQ0FBQyxNQUE4QjtJQUN2RCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUMxQyxNQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVELFFBQVEsTUFBTSxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDN0MsS0FBSyxRQUFRO1lBQ1osSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUN0QixPQUFPLElBQUEsV0FBSSxFQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxxQkFBcUIsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDakYsQ0FBQztZQUVELGtCQUFrQjtZQUNsQixPQUFPLElBQUksQ0FBQztRQUViLEtBQUssT0FBTztZQUNYLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDO1lBQ2hFLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7WUFDOUQsSUFBSSxRQUFRLEVBQUUsQ0FBQztnQkFDZCxPQUFPLElBQUEsV0FBSSxFQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6RCxDQUFDO1lBRUQscUNBQXFDO1lBQ3JDLE9BQU8sSUFBSSxDQUFDO1FBRWI7WUFDQyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQy9CLE9BQU8sSUFBQSxXQUFJLEVBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3hELENBQUM7aUJBQU0sSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUM3QixPQUFPLElBQUEsV0FBSSxFQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2xFLENBQUM7aUJBQU0sQ0FBQztnQkFDUCxtQ0FBbUM7Z0JBQ25DLE9BQU8sSUFBSSxDQUFDO1lBQ2IsQ0FBQztJQUNILENBQUM7QUFDRixDQUFDO0FBRUQsTUFBTSxFQUFFLEdBQWM7SUFDckIsZ0JBQWdCO0NBQ2hCLENBQUM7QUFNRixrQkFBZSxFQUFFLENBQUMifQ==