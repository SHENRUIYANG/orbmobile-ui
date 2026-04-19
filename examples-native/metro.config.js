const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../');
const appNodeModules = path.resolve(projectRoot, 'node_modules');

const config = getDefaultConfig(projectRoot);

// Watch the local library source so edits reload the example app.
config.watchFolders = [workspaceRoot];

// Prefer the example app's runtime dependencies to avoid duplicate React trees.
config.resolver.nodeModulesPaths = [
  appNodeModules,
  path.resolve(appNodeModules, 'expo/node_modules'),
  path.resolve(appNodeModules, 'react-native/node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

config.resolver.unstable_enableSymlinks = true;
config.resolver.disableHierarchicalLookup = true;
config.resolver.extraNodeModules = {
  react: path.resolve(appNodeModules, 'react'),
  'react-native': path.resolve(appNodeModules, 'react-native'),
  'react-native-paper': path.resolve(appNodeModules, 'react-native-paper'),
  'react-native-webview': path.resolve(appNodeModules, 'react-native-webview'),
  '@react-native-community/datetimepicker': path.resolve(
    appNodeModules,
    '@react-native-community/datetimepicker'
  ),
  dayjs: path.resolve(appNodeModules, 'dayjs'),
  'lucide-react-native': path.resolve(appNodeModules, 'lucide-react-native'),
  'orbmobile-ui': path.resolve(workspaceRoot, 'src'),
};

module.exports = config;
