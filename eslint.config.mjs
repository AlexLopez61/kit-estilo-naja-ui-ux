import nextConfig from 'eslint-config-next';
import prettier from 'eslint-config-prettier';

const eslintConfig = [
  ...nextConfig,
  prettier,
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'],
  },
  {
    files: ['components/ui/**', 'hooks/use-mobile.ts'],
    rules: {
      'react-hooks/purity': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
];

export default eslintConfig;
