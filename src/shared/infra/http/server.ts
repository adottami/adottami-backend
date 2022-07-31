import globalConfig from '@/config/global-config/global-config';

import app from './app';

app.listen(globalConfig.port(), () => {
  console.log(`Server is running on port ${globalConfig.port()}.`);
});
